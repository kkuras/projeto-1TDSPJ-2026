export default function CarregandoProdutos() {
  return (
    <div role="status" className="flex min-h-64 items-center justify-center">
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <div>
          <p className="font-semibold text-slate-800">Carregando produtos</p>
          <p className="text-sm text-slate-500">
            Buscando os dados da planilha.
          </p>
        </div>
      </div>
    </div>
  );
}
