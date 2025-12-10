import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com'
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [coursesData, schoolsData] = await Promise.all([
          ApiService.getCourses(),
          ApiService.getSchools()
        ]);
        
        setCourses(coursesData.data || coursesData);
        setSchools(schoolsData.data || schoolsData);
        
        // Load user's courses
        const userCoursesData = await ApiService.getUserCourses(currentUser.id);
        setUserCourses(userCoursesData.data?.courses || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [currentUser.id]);

  // Course enrollment
  const enrollInCourse = async (courseId) => {
    const result = await ApiService.enrollCourse(currentUser.id, courseId);
    if (result.success) {
      // Refresh user courses
      const userCoursesData = await ApiService.getUserCourses(currentUser.id);
      setUserCourses(userCoursesData.data?.courses || []);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.error || 'Enrollment failed' };
  };

  // Track progress
  const trackProgress = async (courseId, progress, score) => {
    return await ApiService.trackProgress(currentUser.id, courseId, progress, score);
  };

  // Add school
  const addSchool = async (schoolData) => {
    const result = await ApiService.addSchool(schoolData);
    if (result._id || result.data) {
      const schoolsData = await ApiService.getSchools();
      setSchools(schoolsData.data || schoolsData);
      return { success: true, data: result };
    }
    return { success: false, error: result.error };
  };

  // Get AI recommendations
  const getRecommendations = async (interest) => {
    return await ApiService.getRecommendations(interest);
  };

  return (
    <DataContext.Provider value={{
      courses,
      userCourses,
      schools,
      loading,
      currentUser,
      enrollInCourse,
      trackProgress,
      addSchool,
      getRecommendations,
      refreshData: async () => {
        const coursesData = await ApiService.getCourses();
        const schoolsData = await ApiService.getSchools();
        setCourses(coursesData.data || coursesData);
        setSchools(schoolsData.data || schoolsData);
      }
    }}>
      {children}
    </DataContext.Provider>
  );
};