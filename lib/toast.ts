export function showToast(message: string, description?: string) {
  // Create a simple notification element
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-4 right-4 bg-[color:var(--color-green)] text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300'
  toast.innerHTML = `
    <div className="font-semibold">${message}</div>
    ${description ? `<div class="text-sm opacity-90">${description}</div>` : ''}
  `
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4')
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}
