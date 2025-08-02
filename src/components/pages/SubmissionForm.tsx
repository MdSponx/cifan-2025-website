@@ .. @@
 const SubmissionForm = () => {
   const { i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
   const [formData, setFormData] = useState({
@@ .. @@
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitSuccess, setSubmitSuccess] = useState(false);
 
  // Check URL parameters for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && ['youth', 'future', 'world'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      showCategoryFields(categoryParam);
      showPrizeInfo(categoryParam);
    }
  }, []);

   // Dynamic typography classes based on language
@@ .. @@
   };
 
  const showCategoryFields = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
  };

   const showPrizeInfo = (category: string) => {
@@ .. @@
                 {/* Category-specific fields */}
                {selectedCategory === 'youth' && (
                   <div className="space-y-4 sm:space-y-6">
@@ .. @@
                 )}
 
                {selectedCategory === 'future' && (
                   <div className="space-y-4 sm:space-y-6">
@@ .. @@
                 )}
 
                {selectedCategory === 'world' && (
                   <div className="space-y-4 sm:space-y-6">