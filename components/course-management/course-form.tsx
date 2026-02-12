'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Course, CourseLevel } from '@/data/courses';
import { CourseFormData, validateCourseForm } from '@/data/utils/validation';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CourseFormProps {
  mode: 'create' | 'edit';
  initialData?: Course;
  onSubmit: (courseData: CourseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  existingCourses?: Course[];
}

export function CourseForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  existingCourses = [],
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || '',
    category: initialData?.category || '',
    level: initialData?.level || '',
    lessons: initialData?.lessons || '',
    duration: initialData?.duration || '',
    rating: initialData?.rating ?? '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
  });

  const [validation, setValidation] = useState({
    isValid: false,
    errors: {} as Partial<Record<keyof CourseFormData, string>>,
    warnings: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const result = validateCourseForm(formData, existingCourses);
    setValidation(result);
  }, [formData, existingCourses]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validation.isValid && !isLoading) {
      await onSubmit(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const levelOptions = [
    { value: '', label: 'Select level' },
    { value: 'Principiante', label: 'Principiante' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
          {validation.warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      )}

      <Input
        label="Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={validation.errors.title}
        placeholder="e.g., Next.js Bootcamp 2026"
      />

      <Input
        label="Category"
        required
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={validation.errors.category}
        placeholder="e.g., Desarrollo Web"
      />

      <Select
        label="Level"
        required
        value={formData.level}
        onChange={(e) =>
          setFormData({ ...formData, level: e.target.value as CourseLevel | '' })
        }
        error={validation.errors.level}
        options={levelOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Number of Lessons"
          type="number"
          required
          min="1"
          max="999"
          value={formData.lessons}
          onChange={(e) =>
            setFormData({ ...formData, lessons: parseInt(e.target.value) || '' })
          }
          error={validation.errors.lessons}
          placeholder="e.g., 24"
        />

        <Input
          label="Duration"
          required
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          error={validation.errors.duration}
          placeholder="e.g., 14 horas"
        />
      </div>

      <Input
        label="Rating"
        type="number"
        required
        min="0"
        max="5"
        step="0.1"
        value={formData.rating}
        onChange={(e) =>
          setFormData({ ...formData, rating: parseFloat(e.target.value) || '' })
        }
        error={validation.errors.rating}
        placeholder="e.g., 4.9"
      />

      <Textarea
        label="Description"
        required
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={validation.errors.description}
        placeholder="Describe what students will learn in this course..."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (optional)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="e.g., Next.js"
          />
          <Button type="button" onClick={handleAddTag} variant="secondary">
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-brand-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {validation.errors.tags && (
          <p className="mt-1 text-sm text-red-600">{validation.errors.tags}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" onClick={onCancel} variant="ghost" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!validation.isValid || isLoading}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Update Course'}
        </Button>
      </div>
    </form>
  );
}
