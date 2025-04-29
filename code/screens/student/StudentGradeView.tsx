import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { compileGradeViewData } from '../../service/dataConverterService';
import type { GradeViewDto, StudentPointDto } from '../../../App';

const StudentGradeView: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudentSectionDetails'>>();
  const { user, sectionPreview } = route.params;

  const [gradeViewData, setGradeViewData] = useState<GradeViewDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const statusColors: { [key: number]: string } = {
    1: '#808080', // Not Attempted
    2: '#FF6B6B', // Failed
    3: '#FFD700', // Needs Revisions
    4: '#4CAF50'  // Passed
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
    return (
      <View
        key={pointDto.point_id}
        style={[styles.pointBox, { backgroundColor }]}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005824" />
        <Text style={styles.loadingText}>Loading grades...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Progress</Text>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
        <Text style={styles.legendText}>Passed</Text>
        <View style={[styles.legendItem, { backgroundColor: '#FFD700' }]} />
        <Text style={styles.legendText}>Needs Revision</Text>
        <View style={[styles.legendItem, { backgroundColor: '#FF6B6B' }]} />
        <Text style={styles.legendText}>Failed</Text>
        <View style={[styles.legendItem, { backgroundColor: '#808080' }]} />
        <Text style={styles.legendText}>Not Attempted</Text>
      </View>

      {/* Table Headers */}
      <View style={styles.gridHeader}>
        <Text style={[styles.gridHeaderText, { flex: 2, textAlign: 'left' }]}>Concept</Text>
        <Text style={styles.gridHeaderText}>Checkpoints</Text>
        <Text style={styles.gridHeaderText}>Test Points</Text>
      </View>

      {/* Topics and Concepts */}
      {gradeViewData?.topicsToConcepts.map((topicToConcepts, topicIndex) => (
        <View key={topicIndex} style={styles.topicSection}>
          <Text style={styles.topicTitle}>{topicToConcepts.topic.topic_title}</Text>

          {topicToConcepts.concepts.map(concept => {
            const { checkPoints, testPoints } = getPointsForConcept(concept.concept_id);
            return (
              <View key={concept.concept_id} style={styles.gridRow}>
                <Text style={[styles.conceptTitle, { flex: 2 }]}>{concept.concept_title}</Text>
                <View style={[styles.pointGroup, { flex: 1 }]}>{checkPoints.map(p => renderPointBox(p))}</View>
                <View style={[styles.pointGroup, { flex: 1 }]}>{testPoints.map(p => renderPointBox(p))}</View>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F2FFED' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#005824' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#005824' },

  // Header for columns
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderColor: '#CDEFC7',
    marginBottom: 12,
  },
  gridHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#005824'
  },

  // Per-topic section
  topicSection: { marginBottom: 24 },
  topicTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#222' },

  // Concept row
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conceptTitle: {
    fontSize: 14,
    color: '#333',
    paddingRight: 8,
  },

  // Boxes
  pointGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  pointBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  // Legend
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8
  },
  legendItem: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 4,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    marginRight: 8,
  },
});

export default StudentGradeView;
