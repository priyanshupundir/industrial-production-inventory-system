export const exportToCSV = (data: Record<string, any>[], filename: string, headersMap: Record<string, string>) => {
  if (!data || !data.length) return;

  const keys = Object.keys(headersMap);
  const headerRow = Object.values(headersMap).join(',');

  const rows = data.map(item => {
    return keys.map(key => {
      let val = item[key] !== undefined && item[key] !== null ? item[key] : '';
      if (typeof val === 'string') {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
