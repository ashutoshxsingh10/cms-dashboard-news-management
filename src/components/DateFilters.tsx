import { useMemo } from 'react';

interface DateFiltersProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateFilters({ selectedDate, onDateChange }: DateFiltersProps) {
  // Generate past 7 days including today
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const isToday = i === 0;
      
      let displayText;
      if (isToday) {
        displayText = 'Today';
      } else {
        displayText = date.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
      }
      
      dates.push({
        value: dateString,
        label: displayText,
        isToday
      });
    }
    
    return dates;
  }, []);

  return (
    <div className="h-10 flex items-center justify-end gap-2 px-4 py-2">
      {dateOptions.map((dateOption) => {
        const isActive = selectedDate === dateOption.value;
        
        return (
          <button
            key={dateOption.value}
            onClick={() => onDateChange(dateOption.value)}
            className={`
              h-8 relative rounded-lg shrink-0 transition-all duration-200
              ${isActive 
                ? 'bg-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)]' 
                : 'hover:bg-gray-50 hover:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]'
              }
            `}
          >
            <div className={`
              box-border flex items-center justify-center h-8 overflow-hidden relative
              ${dateOption.isToday ? 'px-4' : 'px-2'}
            `}>
              <p className="font-medium leading-5 text-sm text-[#344054] whitespace-nowrap">
                {dateOption.label}
              </p>
            </div>
            <div 
              className={`
                absolute inset-0 pointer-events-none rounded-lg border border-solid border-[#d0d5dd]
                ${!isActive ? 'shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]' : ''}
              `} 
            />
          </button>
        );
      })}
    </div>
  );
}