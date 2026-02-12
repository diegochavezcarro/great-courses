'use client';

import { Course, CourseLevel } from '@/data/courses';
import { Search } from '@/components/ui/search';
import { Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseListItem } from './course-list-item';

interface CourseListProps {
  courses: Course[];
  searchQuery: string;
  categoryFilter: string;
  levelFilter: CourseLevel | '';
  onSearchChange: (query: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onLevelFilterChange: (level: CourseLevel | '') => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

export function CourseList({
  courses,
  searchQuery,
  categoryFilter,
  levelFilter,
  onSearchChange,
  onCategoryFilterChange,
  onLevelFilterChange,
  onEditCourse,
  onDeleteCourse,
  onAddNew,
  isLoading = false,
}: CourseListProps) {
  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get unique categories for filter
  const availableCategories = Array.from(new Set(courses.map((c) => c.category)));
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...availableCategories.map((cat) => ({ value: cat, label: cat })),
  ];

  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'Principiante', label: 'Principiante' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
        </h3>
        <Button onClick={onAddNew} variant="primary" size="sm">
          + Add New Course
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <Search
          placeholder="Search courses by title, description, or tags..."
          value={searchQuery}
          onSearch={onSearchChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          />
          <Select
            options={levelOptions}
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value as CourseLevel | '')}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No courses found</p>
          {searchQuery || categoryFilter || levelFilter ? (
            <Button
              onClick={() => {
                onSearchChange('');
                onCategoryFilterChange('');
                onLevelFilterChange('');
              }}
              variant="secondary"
              size="sm"
            >
              Clear Filters
            </Button>
          ) : (
            <Button onClick={onAddNew} variant="primary" size="sm">
              Create Your First Course
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <CourseListItem
              key={course.id}
              course={course}
              onEdit={() => onEditCourse(course)}
              onDelete={() => onDeleteCourse(course)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
