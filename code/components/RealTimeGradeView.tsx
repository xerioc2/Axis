// Combined Real-Time Grade Update Setup for TeacherGradeView and StudentGradeView

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { compileGradeViewData } from '../service/dataConverterService';
import type { GradeViewDto } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '../utils/supabase';
import { debounce } from 'lodash';


const RealTimeGradeView: React.FC<{ isTeacher: boolean }> = ({ isTeacher }) => {
  const route = useRoute<RouteProp<RootStackParamList, 'RealTimeGradeView'>>();

  const navigation = useNavigation();
  const { user, sectionPreview, student } = route.params;
  const targetUser = isTeacher ? student : user;

  const [gradeViewData, setGradeViewData] = useState<GradeViewDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR';

  const statusColors: { [key: number]: string } = {
    1: '#808080',
    2: '#FF6B6B',
    3: '#FFD700',
    4: '#4CAF50',
  };

  const loadGradeViewData = async () => {
    try {
      setLoading(true);
      const data = await compileGradeViewData(user, sectionPreview, targetUser);
      setGradeViewData(data);
    } catch (error) {
      console.error("Failed to load grade data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedRefresh = debounce(async () => {
    try {
      const refreshedData = await compileGradeViewData(user, sectionPreview, targetUser);
      setGradeViewData(refreshedData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, 500);

  const updateLocalGradeData = (currentData: GradeViewDto, updatedPoint: any): GradeViewDto => {
    const updated = { ...currentData };
    updated.conceptsToPoints = updated.conceptsToPoints.map(cp => {
      const idx = cp.points.findIndex(p => p.student_point_id === updatedPoint.id);
      if (idx !== -1) {
        const updatedPoints = [...cp.points];
        let statusName = "";
        switch (updatedPoint.point_status_id) {
          case 1: statusName = "Not Attempted"; break;
          case 2: statusName = "Attempted: Failed"; break;
          case 3: statusName = "Attempted: Needs Revisions"; break;
          case 4: statusName = "Attempted: Passed"; break;
          default: statusName = "Unknown";
        }
        updatedPoints[idx] = {
          ...updatedPoints[idx],
          point_status_id: updatedPoint.point_status_id,
          point_status_name: statusName,
          date_status_last_updated: updatedPoint.date_status_last_updated || new Date().toISOString(),
        };
        return { ...cp, points: updatedPoints };
      }
      return cp;
    });
    return updated;
  };

  useEffect(() => {
    loadGradeViewData();
  }, []);
  type SubscriptionStatus =
  | 'SUBSCRIBED'
  | 'TIMED_OUT'
  | 'CHANNEL_ERROR'
  | 'CLOSED'
  | 'SUBSCRIPTION_ERROR';

useEffect(() => {
  const channel = supabase
    .channel(isTeacher ? 'teacher-grade-refresh' : 'student-grade-refresh')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'student_points',
      filter: `student_id=eq.${targetUser.user_id}`,
    }, async (payload) => {
      try {
        console.log(`📡 Real-time update:`, payload.new);
        setIsRefreshing(true);
        if (gradeViewData && payload.new) {
          const updated = updateLocalGradeData(gradeViewData, payload.new);
          setGradeViewData(updated);
        }
        debouncedRefresh();
      } catch (error) {
        console.error("Error handling real-time update:", error);
        setIsRefreshing(false);
      }
    })
    .subscribe((status: SubscriptionStatus) => {
      if (status === 'SUBSCRIPTION_ERROR') {
        console.error("Subscription error");
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [targetUser.user_id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005824" />
        <Text style={styles.loadingText}>Loading grades...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isRefreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="small" color="#005824" />
          <Text style={styles.refreshText}>Updating grades...</Text>
        </View>
      )}
      {/* Insert rest of your JSX UI below */}
      <ScrollView>
        <Text style={{ fontSize: 18, padding: 16 }}>GradeView for {targetUser.first_name}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FFED',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2FFED',
  },
  loadingText: {
    marginTop: 10,
    color: '#005824',
    fontSize: 16,
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 88, 36, 0.1)',
    borderRadius: 4,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  refreshText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#005824',
  },
});

export default RealTimeGradeView;
