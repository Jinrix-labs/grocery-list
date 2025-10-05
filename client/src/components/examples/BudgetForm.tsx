import { BudgetForm } from '../BudgetForm';

export default function BudgetFormExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <BudgetForm
        onSubmit={(data) => console.log('Budget form submitted:', data)}
        isLoading={false}
      />
    </div>
  );
}
