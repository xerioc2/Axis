import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { 
  SectionInsertDto, 
  Course, 
  SectionTeacherInsertDto,
  Semester,
  Topic,
  Concept,
} from "../../../App";
import { 
  createSection, 
  createSectionTeacher, 
  getCoursesByCreatorId, 
  getCoursesByIds,
  getSemesters,
  getTopicsByCourseId,
  getConceptsByTopicId,
  createPoint
} from "../../service/supabaseService";

// Define a type for a point to be created
type PointToCreate = {
  concept_id: number;
  is_test_point: boolean;
};

// Define a type for concept with point configuration
type ConceptWithPoints = {
  concept_id: number;
  concept_title: string;
  concept_description: string | null;
  topic_id: number;
  checkPoints: number;
  testPoints: number;
};

// Modal type enum - using string values to ensure proper TypeScript comparison
enum ModalType {
  None = 'None',
  Course = 'Course',
  Semester = 'Semester', 
  Topic = 'Topic'
}

const CreateSectionForm: React.FC<{
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ userId, onSuccess, onCancel }) => {
  // Multi-step wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Step 1: Section details
  const [sectionIdentifier, setSectionIdentifier] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Step 2: Point Configuration
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [conceptsByTopic, setConceptsByTopic] = useState<Map<number, ConceptWithPoints[]>>(new Map());
  
  // Default values for all concepts
  const [defaultCheckPoints, setDefaultCheckPoints] = useState(3);
  const [defaultTestPoints, setDefaultTestPoints] = useState(1);
  
  // Step 3: Review all selections
  const [pointsToCreate, setPointsToCreate] = useState<PointToCreate[]>([]);
  
  // Dynamic data
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  
  // Single modal state for all modals
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.None);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdSectionId, setCreatedSectionId] = useState<number | null>(null);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  // Load courses and semesters
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses created by this user
        if (userId) {
          const coursesData = await getCoursesByCreatorId(userId);
          setCourses(coursesData || []);
        } else {
          // If no userId, fetch all courses
          const coursesData = await getCoursesByIds([]);
          setCourses(coursesData || []);
        }
        
        // Fetch semesters using the service method
        const semestersData = await getSemesters();
        setSemesters(semestersData || []);
        
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load necessary data");
      }
    };
    
    fetchData();
  }, [userId]);

  // Load topics when a course is selected
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedCourseId) {
        setAllTopics([]);
        return;
      }
      
      try {
        const topicsData = await getTopicsByCourseId(selectedCourseId);
        setAllTopics(topicsData || []);
        
        // Reset topic selection and concepts
        setSelectedTopicId(null);
        setConceptsByTopic(new Map());
        
        // Load concepts for all topics in this course
        const conceptsMap = new Map<number, ConceptWithPoints[]>();
        
        if (topicsData && topicsData.length > 0) {
          for (const topic of topicsData) {
            const conceptsData = await getConceptsByTopicId(topic.topic_id);
            if (conceptsData && conceptsData.length > 0) {
              // Convert to ConceptWithPoints
              const conceptsWithPoints = conceptsData.map(concept => ({
                ...concept,
                checkPoints: defaultCheckPoints,
                testPoints: defaultTestPoints
              }));
              conceptsMap.set(topic.topic_id, conceptsWithPoints);
            }
          }
        }
        
        setConceptsByTopic(conceptsMap);
      } catch (err: any) {
        console.error("Error fetching topics and concepts:", err);
        setError("Failed to load topics and concepts for this course");
      }
    };
    
    fetchTopics();
  }, [selectedCourseId, defaultCheckPoints, defaultTestPoints]);

  // Platform-specific date change handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'web'); // Only keep open on web
    
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // Get selected course name
  const getSelectedCourseName = () => {
    if (!selectedCourseId) return "Select a course";
    const course = courses.find(c => c.course_id === selectedCourseId);
    if (!course) return "Select a course";
    
    const identifier = course.course_identifier ? `${course.course_identifier} - ` : "";
    return `${identifier}${course.course_name}`;
  };

  // Get selected semester name
  const getSelectedSemesterName = () => {
    if (!selectedSemesterId) return "Select a semester";
    const semester = semesters.find(s => s.semester_id === selectedSemesterId);
    if (!semester) return "Select a semester";
    return `${semester.season} ${semester.year}`;
  };

  // Get selected topic name
  const getSelectedTopicName = () => {
    if (!selectedTopicId) return "All Topics";
    const topic = allTopics.find(t => t.topic_id === selectedTopicId);
    if (!topic) return "All Topics";
    return topic.topic_title;
  };

  // Update point counts for a concept
  const updateConceptPoints = (
    topicId: number,
    conceptId: number,
    checkPoints: number,
    testPoints: number
  ) => {
    setConceptsByTopic(prevState => {
      const newState = new Map(prevState);
      const concepts = [...(newState.get(topicId) || [])];
      const index = concepts.findIndex(c => c.concept_id === conceptId);
      
      if (index !== -1) {
        concepts[index] = {
          ...concepts[index],
          checkPoints,
          testPoints
        };
        newState.set(topicId, concepts);
      }
      
      return newState;
    });
  };

  // Apply default points to all concepts
  const applyDefaultPointsToAll = () => {
    setConceptsByTopic(prevState => {
      const newState = new Map();
      
      prevState.forEach((concepts, topicId) => {
        const updatedConcepts = concepts.map(concept => ({
          ...concept,
          checkPoints: defaultCheckPoints,
          testPoints: defaultTestPoints
        }));
        newState.set(topicId, updatedConcepts);
      });
      
      return newState;
    });
  };

  // Validate each step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!sectionIdentifier.trim()) {
          setError("Section identifier is required");
          return false;
        }
        
        if (!selectedCourseId) {
          setError("Please select a course");
          return false;
        }
        
        if (!selectedSemesterId) {
          setError("Please select a semester");
          return false;
        }
        
        setError("");
        return true;
        
      case 2:
        // Check if there are topics and concepts in the course
        if (allTopics.length === 0) {
          setError("This course has no topics. Please add topics to the course first.");
          return false;
        }
        
        let hasAnyConcepts = false;
        let hasAnyPoints = false;
        
        conceptsByTopic.forEach((concepts) => {
          if (concepts.length > 0) {
            hasAnyConcepts = true;
            concepts.forEach(concept => {
              if (concept.checkPoints > 0 || concept.testPoints > 0) {
                hasAnyPoints = true;
              }
            });
          }
        });
        
        if (!hasAnyConcepts) {
          setError("This course has no concepts. Please add concepts to the topics first.");
          return false;
        }
        
        if (!hasAnyPoints) {
          setError("Please configure at least one concept with points");
          return false;
        }
        
        setError("");
        return true;
        
      case 3:
        // Review step - nothing to validate
        setError("");
        return true;
    }
    
    return true;
  };

  // Move to the next step
  const nextStep = () => {
    if (!validateStep()) return;
    
    if (currentStep === 2) {
      // Compile all points to create before moving to step 3
      const points: PointToCreate[] = [];
      
      conceptsByTopic.forEach((concepts) => {
        concepts.forEach(concept => {
          // Add check points
          for (let i = 0; i < concept.checkPoints; i++) {
            points.push({
              concept_id: concept.concept_id,
              is_test_point: false
            });
          }
          
          // Add test points
          for (let i = 0; i < concept.testPoints; i++) {
            points.push({
              concept_id: concept.concept_id,
              is_test_point: true
            });
          }
        });
      });
      
      setPointsToCreate(points);
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Move to the previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Create section and all configured points with debounce
  const handleSubmit = useCallback(async () => {
    if (isSubmitButtonDisabled) return;
    if (!validateStep() || !userId) return;

    setIsSubmitButtonDisabled(true);
    setIsLoading(true);
    
    try {
      // 1. Create Section
      const sectionData: SectionInsertDto = {
        section_identifier: sectionIdentifier,
        semester_id: selectedSemesterId!,
        course_id: selectedCourseId!,
        date_created: new Date().toISOString().split('T')[0],
        start_date: formatDate(startDate)
      };

      const sectionResult = await createSection(sectionData);
      if (!sectionResult) {
        throw new Error("Failed to create section");
      }
      
      const sectionId = sectionResult.section_id;
      setCreatedSectionId(sectionId);
      
      // 2. Create Section Teacher association
      const sectionTeacherData: SectionTeacherInsertDto = {
        teacher_id: userId,
        section_id: sectionId
      };

      const sectionTeacherResult = await createSectionTeacher(sectionTeacherData);
      if (!sectionTeacherResult) {
        throw new Error("Failed to create section teacher association");
      }
      
      // 3. Create all configured points
      for (const pointData of pointsToCreate) {
        const pointResult = await createPoint({
          is_test_point: pointData.is_test_point,
          section_id: sectionId,
          concept_id: pointData.concept_id
        });
        
        if (!pointResult) {
          console.warn(`Failed to create point for concept ${pointData.concept_id}`);
          // Continue with other points even if one fails
        }
      }

      Alert.alert(
        "Success", 
        `Section created successfully with ${pointsToCreate.length} assessment points!`
      );
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error creating section:", err);
      setError(err.message || "Failed to create section");
      setIsSubmitButtonDisabled(false);
    } finally {
      setIsLoading(false);
      // Reset the button disable after a short delay
      setTimeout(() => {
        setIsSubmitButtonDisabled(false);
      }, 500);
    }
  }, [userId, sectionIdentifier, selectedCourseId, selectedSemesterId, startDate, pointsToCreate, isSubmitButtonDisabled, onSuccess]);

  // Calculate total points
  const calculateTotalPoints = () => {
    let checkPoints = 0;
    let testPoints = 0;
    
    conceptsByTopic.forEach((concepts) => {
      concepts.forEach(concept => {
        checkPoints += concept.checkPoints;
        testPoints += concept.testPoints;
      });
    });
    
    return { checkPoints, testPoints, total: checkPoints + testPoints };
  };

  // Render different step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Section Details</Text>
            <Text style={styles.sectionSubtitle}>
              A section is an instance of a course for a specific semester
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Section Identifier*</Text>
              <TextInput
                style={styles.input}
                value={sectionIdentifier}
                onChangeText={setSectionIdentifier}
                placeholder="e.g., 03, W1, Period 3, etc..."
                returnKeyType="next"
                accessibilityLabel="Section identifier input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Course*</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setActiveModal(ModalType.Course)}
                accessibilityLabel="Select course button"
              >
                <Text style={styles.pickerButtonText}>
                  {getSelectedCourseName()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Semester*</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setActiveModal(ModalType.Semester)}
                accessibilityLabel="Select semester button"
              >
                <Text style={styles.pickerButtonText}>
                  {getSelectedSemesterName()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel="Select date button"
              >
                <Text style={styles.pickerButtonText}>
                  {formatDate(startDate)}
                </Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Platform-specific date picker */}
            {showDatePicker && (
              Platform.OS === 'ios' || Platform.OS === 'android' ? (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                />
              ) : (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )
            )}
          </View>
        );
        
      case 2:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Configure Assessment Points</Text>
            <Text style={styles.sectionSubtitle}>
              Add check points and test points for concepts to assess student understanding
            </Text>
            
            {allTopics.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No topics available for this course. Please add topics in the course management screen.
                </Text>
              </View>
            ) : (
              <>
                {/* Default Points Configuration */}
                <View style={styles.defaultPointsContainer}>
                  <Text style={styles.defaultPointsTitle}>Default Points for All Concepts</Text>
                  
                  <View style={styles.defaultPointsControls}>
                    <View style={styles.pointTypeContainer}>
                      <Text style={styles.pointTypeLabel}>Check Points:</Text>
                      <View style={styles.pointCountControls}>
                        <TouchableOpacity 
                          style={styles.countButton}
                          onPress={() => setDefaultCheckPoints(prev => Math.max(0, prev - 1))}
                          accessibilityLabel="Decrease default check points"
                        >
                          <Text style={styles.countButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.countText}>{defaultCheckPoints}</Text>
                        <TouchableOpacity 
                          style={styles.countButton}
                          onPress={() => setDefaultCheckPoints(prev => prev + 1)}
                          accessibilityLabel="Increase default check points"
                        >
                          <Text style={styles.countButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.pointTypeContainer}>
                      <Text style={styles.pointTypeLabel}>Test Points:</Text>
                      <View style={styles.pointCountControls}>
                        <TouchableOpacity 
                          style={styles.countButton}
                          onPress={() => setDefaultTestPoints(prev => Math.max(0, prev - 1))}
                          accessibilityLabel="Decrease default test points"
                        >
                          <Text style={styles.countButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.countText}>{defaultTestPoints}</Text>
                        <TouchableOpacity 
                          style={styles.countButton}
                          onPress={() => setDefaultTestPoints(prev => prev + 1)}
                          accessibilityLabel="Increase default test points"
                        >
                          <Text style={styles.countButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.applyDefaultsButton}
                    onPress={applyDefaultPointsToAll}
                    accessibilityLabel="Apply to all concepts button"
                  >
                    <Text style={styles.applyDefaultsButtonText}>Apply to All Concepts</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />
                
                {/* Topic Filter */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Filter by Topic</Text>
                  <TouchableOpacity 
                    style={styles.pickerButton}
                    onPress={() => setActiveModal(ModalType.Topic)}
                    accessibilityLabel="Filter by topic button"
                  >
                    <Text style={styles.pickerButtonText}>
                      {getSelectedTopicName()}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Concepts List */}
                <Text style={styles.subheader}>Configure Concept Points</Text>
                <View style={styles.conceptListContainer}>
                  {Array.from(conceptsByTopic.entries())
                    .filter(([topicId, _]) => !selectedTopicId || topicId === selectedTopicId)
                    .flatMap(([topicId, concepts]) => 
                      concepts.map(concept => {
                        const topic = allTopics.find(t => t.topic_id === topicId);
                        return (
                          <View key={concept.concept_id} style={styles.conceptCard}>
                            <View style={styles.conceptHeader}>
                              <Text style={styles.topicLabel}>{topic?.topic_title || "Unknown Topic"}</Text>
                              <Text style={styles.conceptTitle}>{concept.concept_title}</Text>
                            </View>
                            
                            <View style={styles.pointControls}>
                              <View style={styles.pointRow}>
                                <Text style={styles.pointRowLabel}>Check Points:</Text>
                                <View style={styles.pointCountControls}>
                                  <TouchableOpacity 
                                    style={styles.countButton}
                                    onPress={() => updateConceptPoints(
                                      topicId, 
                                      concept.concept_id, 
                                      Math.max(0, concept.checkPoints - 1), 
                                      concept.testPoints
                                    )}
                                    accessibilityLabel={`Decrease check points for ${concept.concept_title}`}
                                  >
                                    <Text style={styles.countButtonText}>-</Text>
                                  </TouchableOpacity>
                                  <Text style={styles.countText}>{concept.checkPoints}</Text>
                                  <TouchableOpacity 
                                    style={styles.countButton}
                                    onPress={() => updateConceptPoints(
                                      topicId, 
                                      concept.concept_id, 
                                      concept.checkPoints + 1, 
                                      concept.testPoints
                                    )}
                                    accessibilityLabel={`Increase check points for ${concept.concept_title}`}
                                  >
                                    <Text style={styles.countButtonText}>+</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              
                              <View style={styles.pointRow}>
                                <Text style={styles.pointRowLabel}>Test Points:</Text>
                                <View style={styles.pointCountControls}>
                                  <TouchableOpacity 
                                    style={styles.countButton}
                                    onPress={() => updateConceptPoints(
                                      topicId, 
                                      concept.concept_id, 
                                      concept.checkPoints, 
                                      Math.max(0, concept.testPoints - 1)
                                    )}
                                    accessibilityLabel={`Decrease test points for ${concept.concept_title}`}
                                  >
                                    <Text style={styles.countButtonText}>-</Text>
                                  </TouchableOpacity>
                                  <Text style={styles.countText}>{concept.testPoints}</Text>
                                  <TouchableOpacity 
                                    style={styles.countButton}
                                    onPress={() => updateConceptPoints(
                                      topicId, 
                                      concept.concept_id, 
                                      concept.checkPoints, 
                                      concept.testPoints + 1
                                    )}
                                    accessibilityLabel={`Increase test points for ${concept.concept_title}`}
                                  >
                                    <Text style={styles.countButtonText}>+</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    )
                  }
                </View>
                
                <View style={styles.pointsSummary}>
                  <Text style={styles.pointsSummaryTitle}>Points Summary</Text>
                  <Text style={styles.pointsSummaryText}>
                    Total Check Points: {calculateTotalPoints().checkPoints}
                  </Text>
                  <Text style={styles.pointsSummaryText}>
                    Total Test Points: {calculateTotalPoints().testPoints}
                  </Text>
                  <Text style={styles.pointsSummaryTotal}>
                    Total Points: {calculateTotalPoints().total}
                  </Text>
                </View>
              </>
            )}
            
            <View style={styles.helpContainer}>
              <Ionicons name="information-circle" size={20} color="#0066cc" />
              <Text style={styles.helpText}>
                Check points are for formative assessment during learning.
                Test points are for summative assessment of mastery.
              </Text>
            </View>
          </View>
        );
        
      case 3:
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Review and Create</Text>
            <Text style={styles.sectionSubtitle}>
              Verify your section details and assessment point configuration
            </Text>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewHeader}>Section Details</Text>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Section:</Text>
                <Text style={styles.reviewValue}>{sectionIdentifier}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Course:</Text>
                <Text style={styles.reviewValue}>{getSelectedCourseName()}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Semester:</Text>
                <Text style={styles.reviewValue}>{getSelectedSemesterName()}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Start Date:</Text>
                <Text style={styles.reviewValue}>{formatDate(startDate)}</Text>
              </View>
            </View>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewHeader}>Assessment Points</Text>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Total Points:</Text>
                <Text style={styles.reviewValue}>{pointsToCreate.length}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Check Points:</Text>
                <Text style={styles.reviewValue}>
                  {pointsToCreate.filter(p => !p.is_test_point).length}
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Test Points:</Text>
                <Text style={styles.reviewValue}>
                  {pointsToCreate.filter(p => p.is_test_point).length}
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Topics:</Text>
                <Text style={styles.reviewValue}>
                  {allTopics.length}
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Concepts:</Text>
                <Text style={styles.reviewValue}>
                  {Array.from(conceptsByTopic.values()).reduce((sum, concepts) => sum + concepts.length, 0)}
                </Text>
              </View>
            </View>
            
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle" size={20} color="#0066cc" />
              <Text style={styles.noteText}>
                Students will be able to join this section with the enrollment code that will be generated.
                Student points will be created automatically when students enroll.
              </Text>
            </View>
          </View>
        );
    }
  };

  // Render the selection modal with dynamic content based on active modal type
  const renderSelectionModal = () => {
    if (activeModal === ModalType.None) return null;
    
    let modalTitle = "";
    let modalContent: JSX.Element | null = null;
    
    switch (activeModal) {
      case ModalType.Course:
        modalTitle = "Select a Course";
        modalContent = (
          <ScrollView style={styles.modalScrollView} keyboardShouldPersistTaps="handled">
            {courses.length === 0 ? (
              <Text style={styles.noItemsText}>No courses available. Create a course first.</Text>
            ) : (
              courses.map((course) => (
                <TouchableOpacity
                  key={course.course_id}
                  style={[
                    styles.modalItem,
                    selectedCourseId === course.course_id && styles.selectedModalItem
                  ]}
                  onPress={() => {
                    setSelectedCourseId(course.course_id);
                    setActiveModal(ModalType.None);
                    // Reset topic and concept selections when course changes
                    setSelectedTopicId(null);
                    setConceptsByTopic(new Map());
                  }}
                  accessibilityLabel={`Select course ${course.course_name}`}
                >
                  <Text style={styles.itemText}>{course.course_name}</Text>
                  {course.course_identifier && (
                    <Text style={styles.itemSubtext}>{course.course_identifier}</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        );
        break;
        
      case ModalType.Semester:
        modalTitle = "Select a Semester";
        modalContent = (
          <ScrollView style={styles.modalScrollView} keyboardShouldPersistTaps="handled">
          {semesters.length === 0 ? (
            <Text style={styles.noItemsText}>No semesters available.</Text>
          ) : (
            semesters.map((semester) => (
              <TouchableOpacity
                key={semester.semester_id}
                style={[
                  styles.modalItem,
                  selectedSemesterId === semester.semester_id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedSemesterId(semester.semester_id);
                  setActiveModal(ModalType.None);
                }}
                accessibilityLabel={`Select semester ${semester.season} ${semester.year}`}
              >
                <Text style={styles.itemText}>{semester.season} {semester.year}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      );
      break;
      
    case ModalType.Topic:
      modalTitle = "Select a Topic";
      modalContent = (
        <ScrollView style={styles.modalScrollView} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={[
              styles.modalItem,
              selectedTopicId === null && styles.selectedModalItem
            ]}
            onPress={() => {
              setSelectedTopicId(null);
              setActiveModal(ModalType.None);
            }}
            accessibilityLabel="Select all topics"
          >
            <Text style={styles.itemText}>All Topics</Text>
          </TouchableOpacity>
          
          {allTopics.length === 0 ? (
            <Text style={styles.noItemsText}>No topics available for this course.</Text>
          ) : (
            allTopics.map((topic) => (
              <TouchableOpacity
                key={topic.topic_id}
                style={[
                  styles.modalItem,
                  selectedTopicId === topic.topic_id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedTopicId(topic.topic_id);
                  setActiveModal(ModalType.None);
                }}
                accessibilityLabel={`Select topic ${topic.topic_title}`}
              >
                <Text style={styles.itemText}>{topic.topic_title}</Text>
                {topic.topic_description && (
                  <Text style={styles.itemSubtext}>{topic.topic_description}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      );
      break;
  }
  
  return (
<Modal
  visible={activeModal === ModalType.Course || 
           activeModal === ModalType.Semester || 
           activeModal === ModalType.Topic}
  transparent={true}
  animationType={Platform.OS === 'android' ? 'slide' : 'fade'}
  onRequestClose={() => setActiveModal(ModalType.None)}
>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          
          {modalContent}
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setActiveModal(ModalType.None)}
            accessibilityLabel="Close selection modal"
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main content render
const renderContent = () => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
  >
    <ScrollView 
      style={styles.scrollView} 
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Create New Section</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onCancel}
          accessibilityLabel="Close form"
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.stepDot,
              currentStep === index + 1 ? styles.activeStepDot : {}
            ]}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {renderStepContent()}

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={prevStep}
            disabled={isLoading || isSubmitButtonDisabled}
            accessibilityLabel="Back to previous step"
          >
            <Ionicons name="arrow-back" size={20} color="#333" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={nextStep}
            disabled={isLoading || isSubmitButtonDisabled}
            accessibilityLabel="Next step"
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button, 
              styles.submitButton,
              (isLoading || isSubmitButtonDisabled) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isLoading || isSubmitButtonDisabled}
            accessibilityLabel="Create section button"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Section</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>

    {/* Single Selection Modal instead of multiple modals */}
    {renderSelectionModal()}
  </KeyboardAvoidingView>
);

// For iOS, wrap in SafeAreaView
if (Platform.OS === 'ios') {
  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}
    </SafeAreaView>
  );
}

// For other platforms, return content directly
return renderContent();
};

const styles = StyleSheet.create({
safeArea: {
  flex: 1,
  backgroundColor: "#f5f5f5",
},
container: {
  flex: 1,
  backgroundColor: "#f5f5f5",
},
scrollView: {
  flex: 1,
},
scrollContent: {
  padding: 16,
  paddingBottom: 32, // Extra padding at bottom
},
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  paddingTop: Platform.OS === 'android' ? 8 : 0,
},
headerText: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#005824",
},
closeButton: {
  padding: 8,
},
stepIndicator: {
  flexDirection: "row",
  justifyContent: "center",
  marginBottom: 20,
},
stepDot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: "#ccc",
  marginHorizontal: 5,
},
activeStepDot: {
  backgroundColor: "#005824",
  width: 12,
  height: 12,
},
errorText: {
  color: "#ff4d4d",
  marginBottom: 10,
  fontSize: 16,
},
formSection: {
  backgroundColor: "#fff",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
  color: "#333",
},
sectionSubtitle: {
  fontSize: 14,
  color: "#666",
  marginBottom: 16,
},
inputGroup: {
  marginBottom: 16,
},
label: {
  fontSize: 16,
  marginBottom: 8,
  color: "#444",
},
input: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  backgroundColor: "#fafafa",
},
pickerButton: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 12,
  backgroundColor: "#fafafa",
},
pickerButtonText: {
  fontSize: 16,
  color: "#333",
},
divider: {
  height: 1,
  backgroundColor: "#ddd",
  marginVertical: 16,
},
defaultPointsContainer: {
  backgroundColor: "#f0f8ff",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
},
defaultPointsTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#0066cc",
  marginBottom: 12,
},
defaultPointsControls: {
  marginBottom: 10,
},
pointTypeContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 8,
},
pointTypeLabel: {
  fontSize: 16,
  color: "#333",
  fontWeight: "500",
},
pointCountControls: {
  flexDirection: "row",
  alignItems: "center",
},
countButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
},
countButtonText: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#333",
},
countText: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#005824",
  marginHorizontal: 16,
  minWidth: 24,
  textAlign: "center",
},
applyDefaultsButton: {
  backgroundColor: "#0066cc",
  padding: 10,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
},
applyDefaultsButtonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
},
subheader: {
  fontSize: 16,
  fontWeight: "bold",
  marginVertical: 10,
  color: "#555",
},
conceptListContainer: {
  marginTop: 10,
},
conceptCard: {
  backgroundColor: "#fff",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ddd",
  marginBottom: 12,
  padding: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 1,
},
conceptHeader: {
  marginBottom: 12,
},
topicLabel: {
  fontSize: 12,
  color: "#666",
  marginBottom: 4,
},
conceptTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333",
},
pointControls: {
  backgroundColor: "#f9f9f9",
  borderRadius: 8,
  padding: 10,
},
pointRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 6,
},
pointRowLabel: {
  fontSize: 14,
  color: "#555",
  width: 100,
},
pointsSummary: {
  backgroundColor: "#e6f7ef",
  borderRadius: 8,
  padding: 16,
  marginTop: 20,
},
pointsSummaryTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#005824",
  marginBottom: 8,
},
pointsSummaryText: {
  fontSize: 14,
  color: "#333",
  marginBottom: 4,
},
pointsSummaryTotal: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#005824",
  marginTop: 8,
},
helpContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f0f8ff",
  padding: 12,
  borderRadius: 8,
  marginTop: 16,
},
helpText: {
  marginLeft: 8,
  fontSize: 14,
  color: "#333",
  flex: 1,
},
noteContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#e6f2ff",
  padding: 12,
  borderRadius: 8,
  marginBottom: 20,
},
noteText: {
  marginLeft: 8,
  fontSize: 14,
  color: "#333",
  flex: 1,
},
reviewSection: {
  marginBottom: 16,
  padding: 12,
  borderWidth: 1,
  borderColor: "#eee",
  borderRadius: 8,
  backgroundColor: "#fafafa",
},
reviewHeader: {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 10,
  color: "#005824",
},
reviewItem: {
  flexDirection: "row",
  marginVertical: 4,
},
reviewLabel: {
  fontSize: 14,
  fontWeight: "500",
  color: "#555",
  width: 100,
},
reviewValue: {
  fontSize: 14,
  color: "#333",
  flex: 1,
},
noDataContainer: {
  padding: 16,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  backgroundColor: "#f9f9f9",
},
noDataText: {
  fontSize: 14,
  color: "#666",
  fontStyle: "italic",
  textAlign: "center",
},
buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
  marginBottom: 32,
},
button: {
  flex: 1,
  padding: 16,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
},
backButton: {
  backgroundColor: "#f0f0f0",
  marginRight: 8,
},
nextButton: {
  backgroundColor: "#005824",
  marginLeft: 8,
},
submitButton: {
  backgroundColor: "#005824",
  marginLeft: 8,
},
disabledButton: {
  backgroundColor: "#7fad97", // Lighter green when disabled
  opacity: 0.8,
},
buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
backButtonText: {
  color: "#333",
  fontSize: 16,
  marginLeft: 5,
},
nextButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginRight: 5,
},
modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: 20,
},
modalContent: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
  width: "100%",
  maxHeight: "80%",
},
modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 16,
  color: "#005824",
  textAlign: "center",
},
modalScrollView: {
  flexGrow: 1, // Use flexGrow instead of maxHeight
},
modalItem: {
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
selectedModalItem: {
  backgroundColor: "#e6f7ef",
},
itemText: {
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
},
itemSubtext: {
  fontSize: 14,
  color: "#666",
  marginTop: 4,
},
noItemsText: {
  padding: 16,
  textAlign: "center",
  color: "#666",
  fontStyle: "italic",
},
modalCloseButton: {
  marginTop: 16,
  padding: 12,
  backgroundColor: "#eee",
  borderRadius: 8,
  alignItems: "center",
},
modalCloseButtonText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333",
},
});

export default CreateSectionForm;