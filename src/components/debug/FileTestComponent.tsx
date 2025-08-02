import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { normalizeFileData, validateFileData, createFileFallback } from '../../utils/fileUtils';

interface TestApplicationData {
  id: string;
  filmTitle: string;
  files: {
    filmFile?: any;
    posterFile?: any;
    proofFile?: any;
  };
}

const FileTestComponent: React.FC = () => {
  const { user } = useAuth();
  const [testData, setTestData] = useState<TestApplicationData[]>([]);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, 'submissions'),
        where('userId', '==', user.uid),
        limit(3)
      );

      const querySnapshot = await getDocs(q);
      const applications: TestApplicationData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          filmTitle: data.filmTitle || 'Untitled',
          files: {
            filmFile: data.files?.filmFile,
            posterFile: data.files?.posterFile,
            proofFile: data.files?.proofFile
          }
        });
      });

      setTestData(applications);
    } catch (error) {
      console.error('Test error:', error);
      alert('Test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const renderFileTest = (fileData: any, fileType: 'image' | 'video' | 'document', label: string) => {
    const normalized = normalizeFileData(fileData);
    const validation = validateFileData(fileData);
    const fallback = createFileFallback(fileType, 'en');

    return (
      <div className="border border-white/20 rounded-lg p-4 mb-4">
        <h4 className="text-white font-semibold mb-2">{label}</h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/60">Raw Data:</p>
            <pre className="text-xs text-white/80 bg-black/20 p-2 rounded overflow-auto">
              {JSON.stringify(fileData, null, 2)}
            </pre>
          </div>
          
          <div>
            <p className="text-white/60">Normalized:</p>
            <div className="text-white/80 space-y-1">
              <p>URL: {normalized.url ? '✅' : '❌'} {normalized.url.substring(0, 50)}...</p>
              <p>Name: {normalized.name ? '✅' : '❌'} {normalized.name}</p>
              <p>Size: {normalized.size ? '✅' : '❌'} {normalized.size} bytes</p>
            </div>
            
            <p className="text-white/60 mt-2">Validation:</p>
            <div className="text-white/80 space-y-1">
              <p>Valid: {validation.isValid ? '✅' : '❌'}</p>
              <p>Has URL: {validation.hasUrl ? '✅' : '❌'}</p>
              <p>Has Name: {validation.hasName ? '✅' : '❌'}</p>
              <p>Has Size: {validation.hasSize ? '✅' : '❌'}</p>
            </div>
            
            {!validation.isValid && (
              <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded">
                <p className="text-red-300 text-xs">
                  {fallback.icon} {fallback.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Test Image/Video Display */}
        {normalized.url && fileType === 'image' && (
          <div className="mt-4">
            <p className="text-white/60 mb-2">Image Test:</p>
            <img
              src={normalized.url}
              alt="Test"
              className="max-w-32 max-h-32 object-cover rounded border"
              onLoad={() => console.log('Image loaded successfully:', normalized.name)}
              onError={() => console.error('Image failed to load:', normalized.name)}
            />
          </div>
        )}

        {normalized.url && fileType === 'video' && (
          <div className="mt-4">
            <p className="text-white/60 mb-2">Video Test:</p>
            <video
              src={normalized.url}
              className="max-w-64 max-h-32 object-cover rounded border"
              controls
              onLoadedMetadata={() => console.log('Video loaded successfully:', normalized.name)}
              onError={() => console.error('Video failed to load:', normalized.name)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">File Storage Test</h2>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={runTest}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {loading ? 'Testing...' : 'Run File Storage Test'}
              </button>
            </div>

            {testData.length > 0 && (
              <div className="space-y-8">
                {testData.map((app, index) => (
                  <div key={app.id} className="border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl text-white font-semibold mb-4">
                      Application {index + 1}: {app.filmTitle}
                    </h3>
                    
                    {renderFileTest(app.files.posterFile, 'image', 'Poster File')}
                    {renderFileTest(app.files.filmFile, 'video', 'Film File')}
                    {app.files.proofFile && renderFileTest(app.files.proofFile, 'document', 'Proof File')}
                  </div>
                ))}
              </div>
            )}

            {testData.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-white/60">Click "Run File Storage Test" to test file fetching</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTestComponent;
