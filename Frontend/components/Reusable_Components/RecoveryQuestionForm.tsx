'use client';

import { FormEvent, useState } from 'react';
import { getErrorMessage } from '@/lib/utils';
import { setPasswordRecoveryQuestion } from '@/services/auth.services';
import { recoveryQuestions } from '@/lib/recoveryQuestions';

export function RecoveryQuestionForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [recoveryQuestion, setRecoveryQuestion] = useState<string>(recoveryQuestions[0]);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await setPasswordRecoveryQuestion({
        currentPassword,
        recoveryQuestion,
        recoveryAnswer: recoveryAnswer.trim(),
      });
      setCurrentPassword('');
      setRecoveryAnswer('');
      setSuccess('Your password recovery question has been saved.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to save your recovery question.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold">Password recovery question</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Set or update the question used to verify you if you forget your password.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="profile-recovery-question" className="mb-2 block text-sm font-medium">
            Recovery question
          </label>
          <select
            id="profile-recovery-question"
            value={recoveryQuestion}
            onChange={(event) => setRecoveryQuestion(event.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {recoveryQuestions.map((question) => (
              <option key={question} value={question}>{question}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="profile-recovery-answer" className="mb-2 block text-sm font-medium">
            Recovery answer
          </label>
          <input
            id="profile-recovery-answer"
            type="text"
            autoComplete="off"
            value={recoveryAnswer}
            onChange={(event) => setRecoveryAnswer(event.target.value)}
            minLength={3}
            maxLength={100}
            required
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">Answers are not case-sensitive.</p>
        </div>
        <div>
          <label htmlFor="profile-recovery-current-password" className="mb-2 block text-sm font-medium">
            Confirm with your current password
          </label>
          <input
            id="profile-recovery-current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            maxLength={72}
            required
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {success && <p role="status" className="text-sm text-green-700">{success}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save recovery question'}
        </button>
      </form>
    </section>
  );
}
