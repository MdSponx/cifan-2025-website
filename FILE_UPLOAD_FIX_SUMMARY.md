# File Upload Issue Fix Summary

## Problem Description
Version 2 of the submission form was not saving files properly. Draft submissions were always setting files to null instead of uploading and storing file metadata when files were provided.

## Root Cause Analysis
The `saveDraftYouthForm()` and `saveDraftFutureForm()` methods were:
1. Skipping file upload entirely for draft mode
2. Always setting files to null in the database
3. Not utilizing the conditional file upload capability

## Implemented Solution

### 1. Modified `saveDraftYouthForm()` Method
- **Before**: Always skipped file uploads for drafts
- **After**: Conditionally uploads files if they exist in formData
- Added file existence check: `const hasFiles = formData.filmFile || formData.posterFile || formData.proofFile`
- Calls new `uploadFilesForDraft()` method when files are present
- Passes fileMetadata to `saveDraftToFirestore()`

### 2. Modified `saveDraftFutureForm()` Method  
- Applied the same conditional file upload logic as youth form
- Added file existence check and conditional upload flow
- Enhanced error handling with cleanup and storage permission guidance

### 3. Created `uploadFilesForDraft()` Method
- **Purpose**: Upload only files that exist (not all files required for drafts)
- **Features**:
  - Dynamic file progress tracking based on existing files
  - Selective file upload requests
  - Proper file mapping back to result object
  - Error handling with cleanup

### 4. Updated `saveDraftToFirestore()` Method
- **Before**: Always set files to null
- **After**: Accept optional `fileMetadata` parameter
- **Logic**: Use uploaded file data if available, otherwise set to null
- Maintains same structure as regular submissions

### 5. Enhanced `validateFormData()` Method
- Already had `isDraft` parameter (default false)
- **For final submission**: Requires all files
- **For draft mode**: Files are optional, no validation needed

## Key Changes Made

### File Structure Comparison

**Before (Broken Structure):**
```json
{
  "files": {
    "filmFile": null,
    "posterFile": null, 
    "proofFile": null
  },
  "status": "draft"
}
```

**After (Fixed Structure):**
```json
{
  "files": {
    "filmFile": {
      "downloadURL": "https://firebasestorage.googleapis.com/...",
      "fileName": "IMG_5115.MOV",
      "fileSize": 17486795,
      "fileType": "video/quicktime", 
      "storagePath": "submissions/youth_draft_1753514202197_0kchup8dg/film/1753514202199_IMG_5115.MOV",
      "uploadedAt": "July 26, 2025 at 2:16:47 PM UTC+7"
    },
    "posterFile": { /* complete data or null */ },
    "proofFile": { /* complete data or null */ }
  },
  "status": "draft"
}
```

## Implementation Details

### Conditional Upload Logic
```typescript
// Check if any files exist in formData
const hasFiles = formData.filmFile || formData.posterFile || formData.proofFile;

if (hasFiles) {
  this.updateProgress('uploading', 20, 'Uploading files...');
  fileMetadata = await this.uploadFilesForDraft(formData, this.submissionId);
  this.updateProgress('saving', 70, 'Saving draft with files...');
} else {
  this.updateProgress('saving', 50, 'Saving draft...');
}
```

### Dynamic File Upload
```typescript
// Only add files that exist to upload requests
if (formData.filmFile) {
  uploadRequests.push({
    file: formData.filmFile,
    path: generateFilePath(submissionId, 'film', formData.filmFile.name),
    onProgress: (progress) => { /* progress tracking */ }
  });
}
```

### Conditional File Storage
```typescript
files: {
  filmFile: fileMetadata?.filmFile ? {
    ...fileMetadata.filmFile,
    uploadedAt: serverTimestamp()
  } : null,
  posterFile: fileMetadata?.posterFile ? {
    ...fileMetadata.posterFile,
    uploadedAt: serverTimestamp()
  } : null,
  proofFile: fileMetadata?.proofFile ? {
    ...fileMetadata.proofFile,
    uploadedAt: serverTimestamp()
  } : null
}
```

## Expected Outcomes

✅ **Draft submissions now have the same file structure as submitted forms**
✅ **Files are properly uploaded and URLs saved when provided**
✅ **Poster and video files are displayable in draft mode**
✅ **Backward compatibility maintained**
✅ **No files required for drafts (optional upload)**
✅ **Proper error handling and cleanup**

## Benefits

1. **Consistent Data Structure**: Draft and submitted forms now have identical file structures
2. **Flexible File Upload**: Users can upload files during draft creation or leave them for later
3. **Improved User Experience**: Files uploaded during draft creation are preserved and accessible
4. **Better Error Handling**: Enhanced error messages and cleanup procedures
5. **Maintainable Code**: Clear separation between draft and final submission logic

## Files Modified

- `src/services/submissionService.ts`
  - Modified `saveDraftYouthForm()` method
  - Modified `saveDraftFutureForm()` method  
  - Added `uploadFilesForDraft()` method
  - Updated `saveDraftToFirestore()` method signature and logic
  - Enhanced error handling throughout

## Testing Recommendations

1. Test draft creation with no files
2. Test draft creation with some files (partial upload)
3. Test draft creation with all files
4. Verify file URLs are accessible after draft save
5. Test error scenarios (network issues, permission errors)
6. Verify backward compatibility with existing drafts

The fix ensures that Version 2 draft submissions properly handle file uploads while maintaining the flexibility of optional file requirements for draft mode.
