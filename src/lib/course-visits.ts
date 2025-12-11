'use client';

import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface CourseInfo {
  id: string;
  name: string;
  url: string;
}

export function trackCourseVisit(firestore: Firestore, course: CourseInfo) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    // Don't track visits for anonymous users
    return;
  }

  const visitRef = doc(firestore, 'users', user.uid, 'course_visits', course.id);

  const visitData = {
    courseName: course.name,
    courseUrl: course.url,
    lastVisited: serverTimestamp(),
  };

  setDoc(visitRef, visitData, { merge: true }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: visitRef.path,
      operation: 'write',
      requestResourceData: visitData,
    });
    // Emit the error with the global error emitter
    errorEmitter.emit('permission-error', permissionError);
  });
}
