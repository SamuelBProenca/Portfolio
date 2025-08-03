export default function HProjects() {
    return (
        <>
            {/* Projects */}
            <section id="projects" className="mb-20 mt-40">
                <h3 className="text-2xl font-semibold mb-6 border-b border-neutral-800 pb-2 ">Projetos em destaque</h3>
                <div className="grid md:grid-cols-2 gap-8 mt-4" >
                    <div className="bg-neutral-900 p-6 rounded-xl shadow-md hover:shadow-cyan-600/30 transition">
                        <h4 className="text-xl font-semibold mb-2">OctoCards</h4>
                        
                        <p className="text-neutral-400 text-sm">App que transforma seu GitHub em um portfólio de cards interativos.</p>
                    </div>
                    <div className="bg-neutral-900 p-6 rounded-xl shadow-md hover:shadow-cyan-600/30 transition">
                        <h4 className="text-xl font-semibold mb-2">Gerador de Notas</h4>
                        <p className="text-neutral-400 text-sm">Sistema PHP para emissão automática de notas fiscais com painel completo.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
