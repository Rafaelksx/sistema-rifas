const SupportTickets = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-black">Tickets de Soporte</h1>
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
       <div className="text-center py-20">
          <LifeBuoy size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">No hay tickets pendientes por responder.</p>
       </div>
    </div>
  </div>
);