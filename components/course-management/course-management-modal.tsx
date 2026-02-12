'use client';

import { useState, useCallback } from 'react';
import { Course, CourseLevel } from '@/data/courses';
import { CourseFormData } from '@/data/utils/validation';
import { CourseService } from '@/data/services/course-service';
import { Modal } from '@/components/ui/modal';
import { CourseList } from './course-list';
import { CourseForm } from './course-form';
import { DeleteConfirmation } from './delete-confirmation';

type ModalView = 'list' | 'create' | 'edit' | 'delete';

interface CourseManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
}

export function CourseManagementModal({
  isOpen,
  onClose,
  courses,
  onCoursesUpdate,
}: CourseManagementModalProps) {
  const [currentView, setCurrentView] = useState<ModalView>('list');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<CourseLevel | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create service instance
  const courseService = new CourseService(courses, onCoursesUpdate);

  const handleClose = useCallback(() => {
    setCurrentView('list');
    setSelectedCourse(null);
    setSearchQuery('');
    setCategoryFilter('');
    setLevelFilter('');
    setError(null);
    onClose();
  }, [onClose]);

  const showCourseList = useCallback(() => {
    setCurrentView('list');
    setSelectedCourse(null);
    setError(null);
  }, []);

  const showCreateForm = useCallback(() => {
    setCurrentView('create');
    setSelectedCourse(null);
    setError(null);
  }, []);

  const showEditForm = useCallback((course: Course) => {
    setCurrentView('edit');
    setSelectedCourse(course);
    setError(null);
  }, []);

  const showDeleteConfirmation = useCallback((course: Course) => {
    setCurrentView('delete');
    setSelectedCourse(course);
    setError(null);
  }, []);

  const handleCreateCourse = async (formData: CourseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      courseService.createCourse(formData);
      showCourseList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (formData: CourseFormData) => {
    if (!selectedCourse) return;

    setIsLoading(true);
    setError(null);

    try {
      const updated = courseService.updateCourse(selectedCourse.id, formData);
      if (!updated) {
        throw new Error('Course not found');
      }
      showCourseList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = courseService.deleteCourse(selectedCourse.id);
      if (!success) {
        throw new Error('Course not found');
      }
      showCourseList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (currentView) {
      case 'create':
        return 'Create New Course';
      case 'edit':
        return 'Edit Course';
      case 'delete':
        return 'Delete Course';
      default:
        return 'Manage Courses';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getModalTitle()}>
      {currentView === 'list' && (
        <CourseList
          courses={courses}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          levelFilter={levelFilter}
          onSearchChange={setSearchQuery}
          onCategoryFilterChange={setCategoryFilter}
          onLevelFilterChange={setLevelFilter}
          onEditCourse={showEditForm}
          onDeleteCourse={showDeleteConfirmation}
          onAddNew={showCreateForm}
        />
      )}

      {currentView === 'create' && (
        <CourseForm
          mode="create"
          onSubmit={handleCreateCourse}
          onCancel={showCourseList}
          isLoading={isLoading}
          error={error || undefined}
          existingCourses={courses}
        />
      )}

      {currentView === 'edit' && selectedCourse && (
        <CourseForm
          mode="edit"
          initialData={selectedCourse}
          onSubmit={handleUpdateCourse}
          onCancel={showCourseList}
          isLoading={isLoading}
          error={error || undefined}
          existingCourses={courses}
        />
      )}

      {currentView === 'delete' && selectedCourse && (
        <DeleteConfirmation
          course={selectedCourse}
          onConfirm={handleDeleteCourse}
          onCancel={showCourseList}
          isLoading={isLoading}
          error={error || undefined}
        />
      )}
    </Modal>
  );
}
