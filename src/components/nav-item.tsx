export default function NavItem({
    icon: Icon,
    label,
    active,
    showLabel = true,
  }: {
    icon: React.ElementType
    label: string
    active?: boolean
    showLabel?: boolean
  }) {
    return (
      <button
        className={`w-full flex items-center ${showLabel ? "justify-start space-x-2" : "justify-center"} px-3 py-2 rounded-md transition ${
          active ? "bg-[#1e293b]/70 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-[#1e293b]/30"
        }`}
      >
        <Icon className="h-4 w-4" />
        {showLabel && <span>{label}</span>}
      </button>
    )
  }
  