import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { compileGradeViewData } from '../../service/dataConverterService';
import type { GradeViewDto, StudentPointDto } from '../../../App';
import { Ionicons } from '@expo/vector-icons';

const StudentGradeView: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudentSectionDetails'>>();
  const navigation = useNavigation();
  const { user, sectionPreview } = route.params;

  const [gradeViewData, setGradeViewData] = useState<GradeViewDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const statusColors: { [key: number]: string } = {
    1: '#808080',
    2: '#FF6B6B',
    3: '#FFD700',
    4: '#4CAF50'
  };

  useEffect(() => {
    const loadGradeViewData = async () => {
      const data = await compileGradeViewData(user, sectionPreview, user);
      setGradeViewData(data);
      setLoading(false);
    };
    loadGradeViewData();
  }, []);

  const getPointsForConcept = (conceptId: number) => {
    if (!gradeViewData) return { checkPoints: [], testPoints: [] };
    const conceptPoints = gradeViewData.conceptsToPoints.find(item => item.concept.concept_id === conceptId);
    if (!conceptPoints) return { checkPoints: [], testPoints: [] };
    const checkPoints = conceptPoints.points.filter(point => !point.is_test_point);
    const testPoints = conceptPoints.points.filter(point => point.is_test_point);
    return { checkPoints, testPoints };
  };

  const renderPointBox = (pointDto: StudentPointDto) => {
    const backgroundColor = statusColors[pointDto.point_status_id] || '#FFFFFF';
    return <View key={pointDto.point_id} style={[styles.pointBox, { backgroundColor }]} />;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005824" />
        <Text style={styles.loadingText}>Loading grades...</Text>
      </View>
    );
  }
  const countStatuses = (): Record<number, number> => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  
    if (!gradeViewData) return counts;
  
    for (const concept of gradeViewData.conceptsToPoints) {
      for (const point of concept.points) {
        counts[point.point_status_id] = (counts[point.point_status_id] || 0) + 1;
      }
    }
  
    return counts;
  };
  
  const statusCounts = countStatuses(); // ✅ ADD THIS
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>

        <View style={styles.gradesContainer}>
          <Text style={styles.header}>Your Progress</Text>

          <View style={styles.legendContainer}>
            <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} /><Text style={styles.legendText}>Passed</Text>
            <View style={[styles.legendItem, { backgroundColor: '#FFD700' }]} /><Text style={styles.legendText}>Needs Revision</Text>
            <View style={[styles.legendItem, { backgroundColor: '#FF6B6B' }]} /><Text style={styles.legendText}>Failed</Text>
            <View style={[styles.legendItem, { backgroundColor: '#808080' }]} /><Text style={styles.legendText}>Not Attempted</Text>
          </View>

          <View style={styles.columnLabels}>
          <Text style={styles.conceptLabel}>Concept</Text>
  <View style={{ flex: 4, alignItems: 'center' }}>
    <Text style={styles.columnHeaderText}>Check Points</Text>
  </View>
  <View style={{ flex: 5, alignItems: 'center' }}>
    <Text style={styles.columnHeaderText}>Test Points</Text>
  </View>
</View>


          {gradeViewData?.topicsToConcepts.map((topicToConcepts, topicIndex) => (
            <View key={topicIndex} style={styles.topicContainer}>
              <Text style={styles.topicTitle}>{topicToConcepts.topic.topic_title}</Text>

              {topicToConcepts.concepts.map(concept => {
                const { checkPoints, testPoints } = getPointsForConcept(concept.concept_id);
                return (
                  <View key={concept.concept_id} style={styles.conceptRow}>
                    <Text style={styles.conceptTitle} numberOfLines={2}>{concept.concept_title}</Text>
                    <View style={styles.pointsContainer}>
                      <View style={styles.checkPointsContainer}>
                        {checkPoints.length > 0 ? (
                          <View style={styles.pointBoxRow}>{checkPoints.map(p => renderPointBox(p))}</View>
                        ) : <Text style={styles.noPointsText}>None</Text>}
                      </View>
                      <View style={styles.testPointsContainer}>
                        {testPoints.length > 0 ? (
                          <View style={styles.pointBoxRow}>{testPoints.map(p => renderPointBox(p))}</View>
                        ) : <Text style={styles.noPointsText}>None</Text>}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Student Grades</Text>
      </View>
      <View style={styles.summaryContainer}>
  <Text style={styles.summaryText}>✅ Passed: {statusCounts[4]}</Text>
  <Text style={styles.summaryText}>🟡 Needs Revision: {statusCounts[3]}</Text>
  <Text style={styles.summaryText}>❌ Failed: {statusCounts[2]}</Text>
  <Text style={styles.summaryText}>⬜ Not Attempted: {statusCounts[1]}</Text>
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2FFED' },
  content: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2FFED' },
  loadingText: { marginTop: 10, color: '#005824', fontSize: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backButtonText: { fontSize: 16, color: '#005824', marginLeft: 5 },
  gradesContainer: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#005824', marginBottom: 15 },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 16, gap: 8 },
  legendItem: { width: 16, height: 16, borderRadius: 3, marginRight: 4, borderColor: '#DDD', borderWidth: 1 },
  legendText: { fontSize: 12, marginRight: 8 },
  columnLabels: { flexDirection: 'row', paddingBottom: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  conceptLabel: { flex: 3, fontWeight: 'bold', color: '#555' },
  checkPointsLabel: { flex: 2, fontWeight: 'bold', textAlign: 'center', color: '#555' },
  testPointsLabel: { flex: 2, fontWeight: 'bold', textAlign: 'center', color: '#555' },
  topicContainer: { marginBottom: 20 },
  topicTitle: { fontSize: 16, fontWeight: 'bold', backgroundColor: '#EEEEEE', padding: 10, borderRadius: 5, marginBottom: 10, color: '#005824' },
  conceptRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', alignItems: 'center' },
  conceptTitle: { flex: 3, fontSize: 14, color: '#333' },
  pointsContainer: { flex: 4, flexDirection: 'row' },
  checkPointsContainer: { flex: 2, justifyContent: 'center', paddingRight: 4 },
  testPointsContainer: { flex: 2, justifyContent: 'center', paddingLeft: 4 },
  pointBoxRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  pointBox: { width: 18, height: 18, borderRadius: 3, borderWidth: 1, borderColor: '#DDDDDD' },
  noPointsText: { fontSize: 12, color: '#AAAAAA', textAlign: 'center', fontStyle: 'italic' },
  footer: { height: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd' },
  columnHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  
  
  footerTitle: { fontSize: 18, fontWeight: 'bold', color: '#005824' },
});

export default StudentGradeView;
