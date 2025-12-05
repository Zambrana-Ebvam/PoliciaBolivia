import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">

      <section id="inicio" className="block">
        <h2>Bienvenido a la Policía Boliviana</h2>
        <p>Portal Informativo - Próximamente</p>
      </section>

      <section id="quienes" className="block">
        <h2>Quiénes Somos</h2>
        <p>Información oficial próximamente...</p>
      </section>

      <section id="info" className="block">
        <h2>Información General</h2>
        <p>Contenido en preparación...</p>
      </section>

      <section id="proximamente" className="block">
        <h2>Nuevas funcionalidades</h2>
        <p>Muy pronto podrás consultar datos oficiales mediante nuestra API.</p>
      </section>

    </div>
  );
}
