import { AiExpenseInsights } from "@/components/ai/AiExpenseInsights";

const ExpensesPage = () => {
  const userId = "user-123"; // TODO: Replace with actual user ID from auth

  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Expenses</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Expense Chart</h3>
            <p className="text-neutral-400">Expense visualization coming soon...</p>
          </div>
          
          {/* AI Expense Insights integrated inline */}
          <AiExpenseInsights 
            userId={userId}
            onAutoCategorize={() => {
              console.log("Auto-categorize triggered");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
