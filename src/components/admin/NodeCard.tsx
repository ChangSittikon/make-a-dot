"use client";

interface NodeOption {
  label: string;
  icon?: string;
  targetLabel?: string;
  targetType?: "question" | "result" | "empty";
}

interface NodeCardProps {
  number: number;
  label: string; // e.g. "Start Node", "คำถามที่ 2"
  question: string;
  options: NodeOption[];
  dotColor?: string; // tailwind class e.g. "bg-brand-red", "bg-blue-500"
  onEdit?: () => void;
  showAddOption?: boolean;
  gridCols?: number;
}

export function NodeCard({
  number,
  label,
  question,
  options,
  dotColor = "bg-brand-red",
  onEdit,
  showAddOption = false,
  gridCols,
}: NodeCardProps) {
  const targetBadgeStyle = (type?: string) => {
    switch (type) {
      case "question":
        return "bg-blue-100 text-blue-600";
      case "result":
        return "bg-green-100 text-green-600";
      case "empty":
        return "bg-red-100 text-brand-red";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm z-10 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${dotColor} rounded-full`} />
          <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <i className="fa-solid fa-pen-to-square" />
          </button>
        )}
      </div>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{question}</h2>

      <div className={gridCols ? `grid grid-cols-${gridCols} gap-2` : "space-y-2"}>
        {options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100 cursor-pointer hover:border-brand-red transition-colors gap-2"
          >
            <div className="flex items-center gap-2">
              {opt.icon && <i className={`${opt.icon} text-gray-400 text-xs w-4 text-center`} />}
              <span className="text-xs font-medium flex-1">{opt.label}</span>
            </div>
            {opt.targetLabel && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${targetBadgeStyle(opt.targetType)}`}>
                {opt.targetLabel}
              </span>
            )}
          </div>
        ))}
        {showAddOption && (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition">
            <i className="fa-solid fa-plus text-xs" />
            <span className="text-[10px] ml-1">เพิ่มตัวเลือก</span>
          </div>
        )}
      </div>
    </div>
  );
}
