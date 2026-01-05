import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, FilterTabs, EmptyState } from '../../common';
import { QuestionItem } from './QuestionItem';
import { QuestionModal } from './QuestionModal';
import type { Question } from '../../../types';

interface QuestionListProps {
  questions: Question[];
  onAdd: (data: Partial<Question>) => void;
  onUpdate: (id: string, data: Partial<Question>) => void;
  onDelete: (id: string) => void;
}

export function QuestionList({ questions, onAdd, onUpdate, onDelete }: QuestionListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-discussion', label: 'In Discussion' },
    { value: 'answered', label: 'Answered' },
    { value: 'deferred', label: 'Deferred' },
  ];

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesFilter = filter === 'all' || q.status === filter;
      const matchesSearch =
        searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [questions, filter, searchQuery]);

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<Question>) => {
    if (editingQuestion) {
      onUpdate(editingQuestion.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleStatusChange = (id: string, status: Question['status']) => {
    onUpdate(id, { status });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Questions</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Question
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          title="No questions found"
          description={
            filter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search query'
              : 'Add your first question to get started'
          }
          action={
            filter === 'all' && !searchQuery ? (
              <Button onClick={() => setIsModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onEdit={handleEdit}
              onDelete={onDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        question={editingQuestion}
      />
    </div>
  );
}
