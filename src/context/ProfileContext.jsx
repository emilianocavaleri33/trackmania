import { createContext, useContext, useEffect, useState } from 'react';
import { techniques } from '../data/techniques';

const ProfileContext = createContext();

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}

export function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('trackmania_profile');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Initialize with empty structure
    return {
      quizResults: {},
      studiedTechniques: [],
      completedTechniques: [],
      totalScore: 0,
      averageScore: 0,
      perfectQuizzes: 0,
      lastUpdated: null,
      profileName: 'Campione TrackMania',
      joinDate: new Date().toISOString()
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('trackmania_profile', JSON.stringify(profileData));
  }, [profileData]);

  // Calculate statistics whenever quiz results change
  useEffect(() => {
    const { quizResults } = profileData;
    const completedCount = Object.keys(quizResults).length;
    const scores = Object.values(quizResults).map(r => r.percentage || 0);
    const avgScore = completedCount > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / completedCount) : 0;
    const perfectCount = scores.filter(s => s === 100).length;
    const studiedList = Object.keys(quizResults);
    const completedList = Object.keys(quizResults).filter(slug => quizResults[slug].percentage >= 60);

    setProfileData(prev => ({
      ...prev,
      studiedTechniques: studiedList,
      completedTechniques: completedList,
      totalScore: scores.reduce((a, b) => a + b, 0),
      averageScore: avgScore,
      perfectQuizzes: perfectCount,
      lastUpdated: new Date().toISOString()
    }));
  }, [profileData.quizResults]);

  const saveQuizResult = (techniqueSlug, score, total) => {
    const percentage = Math.round((score / total) * 100);
    
    setProfileData(prev => ({
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [techniqueSlug]: {
          score,
          total,
          percentage,
          timestamp: new Date().toISOString(),
          attempts: (prev.quizResults[techniqueSlug]?.attempts || 0) + 1
        }
      }
    }));
  };

  const markTechniqueStudied = (techniqueSlug) => {
    setProfileData(prev => ({
      ...prev,
      studiedTechniques: [...new Set([...prev.studiedTechniques, techniqueSlug])]
    }));
  };

  const clearAllData = () => {
    setProfileData({
      quizResults: {},
      studiedTechniques: [],
      completedTechniques: [],
      totalScore: 0,
      averageScore: 0,
      perfectQuizzes: 0,
      lastUpdated: null,
      profileName: 'Campione TrackMania',
      joinDate: new Date().toISOString()
    });
  };

  const updateProfileName = (newName) => {
    setProfileData(prev => ({
      ...prev,
      profileName: newName
    }));
  };

  const value = {
    profileData,
    saveQuizResult,
    markTechniqueStudied,
    clearAllData,
    updateProfileName,
    // Computed properties
    completedCount: profileData.studiedTechniques.length,
    totalTechniques: techniques.length,
    completionPercentage: Math.round((profileData.studiedTechniques.length / techniques.length) * 100),
    isTechniqueStudied: (slug) => profileData.studiedTechniques.includes(slug),
    isTechniqueCompleted: (slug) => profileData.completedTechniques.includes(slug),
    getTechniqueResult: (slug) => profileData.quizResults[slug]
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
