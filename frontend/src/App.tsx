// function App() {

//   return (
//     <>

//     </>
//   )
// }

// export default App

import DisposicionPrincipal from './Components/Disposicion/DisposicionPrincipal';
import ListaEsperaPage from './Features/listaEspera/ListaEsperaPage';

export default function App() {
  return (
    <DisposicionPrincipal seccionActiva="Lista de Espera">
      <ListaEsperaPage />
    </DisposicionPrincipal>
  );
}