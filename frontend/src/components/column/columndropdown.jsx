// import React from 'react'

// const ColumnDropdown = ({ isOpen, setIsOpen, availableColumns, columnsData, onSelectColumn }) => {
//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
//       >
//         📋 Add Column Layout ▾
//       </button>
      
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
//           {availableColumns.map((colName) => {
//             const isAdded = columnsData?.some(
//               (c) => c.title.toLowerCase() === colName.toLowerCase()
//             )
//             return (
//               <button
//                 key={colName}
//                 disabled={isAdded}
//                 onClick={() => onSelectColumn(colName)}
//                 className={`w-full text-left px-4 py-2.5 text-xs font-medium border-b border-b-slate-100 last:border-0 transition-colors ${
//                   isAdded 
//                     ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
//                     : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
//                 }`}
//               >
//                 {colName} {isAdded && '✓'}
//               </button>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

// export default ColumnDropdown
