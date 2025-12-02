import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/home/welcome";
import Login from "./pages/user/login";
import Cadastro from "./pages/user/cadastro";
import Home from "./pages/home/home";
import Loja from "./pages/pets/loja";
import EditarPerfil from "./pages/user/editar_p_dono";
import MeusPets from "./pages/pets/meus_pets";
import PrivateRoute from "./components/PrivateRoute";
import PetDetalhes from "./pages/pets/pet_detalhes";
import CadastrarPet from "./pages/pets/cadastrar_pet";
import EditarPet from "./pages/pets/editar_pet";
import Consultas from "./pages/pets/consulta";
import ServicosPet from "./pages/pets/pet_shop";
import Passeios from "./pages/pets/passeios";
import ActivityTimeout from "./components/ActivityTimeout";
import Sobre from "./pages/home/sobre";
import Carrinho from "./pages/pets/cart";
import ConsultaEscolherPet from "./pages/pets/escolher_pets";
import ConsultaAgendar from "./pages/pets/consulta_agendamento";
import ConsultaHistorico from "./pages/pets/consulta_historico";
import PetShop from "./pages/pets/pet_shop";
import PetShopAgendar from "./pages/pets/petshop_agendar";
import PetShopEscolherPets from "./pages/pets/petshop_escolher_pets";
import PetShopHistorico from "./pages/pets/petshop_historico";
import Vacinas from "./pages/pets/vacinas";
import VacinasEscolherPet from "./pages/pets/vacina_escolher_pet";
import VacinasAgendar from "./pages/pets/vacina_agendar";
import VacinasHistorico from "./pages/pets/vacina_historico";
import PasseiosEscolherPet from "./pages/pets/passeio_escolher_pet";
import PasseiosAgendar from "./pages/pets/passeio_agendar";
import PasseiosHistorico from "./pages/pets/passeio_historico";

function App() {
  return (
    <Router>
      <ActivityTimeout />
        {/* rotas */}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/editar_p_dono" element={<EditarPerfil />} />
        <Route path="/meus_pets" element={<MeusPets />} />
        <Route path="/pets/:id" element={<PetDetalhes />} />
        <Route path="/cadastrar-pet" element={<CadastrarPet />} />
        <Route path="/editar_pet/:id" element={<EditarPet />} />
        <Route path="/consulta" element={<Consultas />} />
        <Route path="/passeios" element={<Passeios />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/cart" element={<Carrinho />} />
        <Route path="/consultas/escolher_pets" element={<ConsultaEscolherPet />} />
        <Route path="/consultas/agendar" element={<ConsultaAgendar />} />
        <Route path="/consultas/historico" element={<ConsultaHistorico />} />
        <Route path="/petshop" element={<PetShop />} />
        <Route path="/petshop/escolher" element={<PetShopEscolherPets />} />
        <Route path="/petshop/agendar" element={<PetShopAgendar />} />
        <Route path="/petshop/historico" element={<PetShopHistorico />} />
        <Route path="/vacinas" element={<Vacinas />} />
        <Route path="/vacinas/escolher_pet" element={<VacinasEscolherPet />} />
        <Route path="/vacinas/agendar" element={<VacinasAgendar />} />
        <Route path="/vacinas/historico" element={<VacinasHistorico />} />
        <Route path="/passeios" element={<Passeios />} />
        <Route path="/passeios/escolher" element={<PasseiosEscolherPet />} />
        <Route path="/passeios/agendar" element={<PasseiosAgendar />} />
        <Route path="/passeios/historico" element={<PasseiosHistorico />} />
       

        {/* ROTA PROTEGIDA */}
        <Route
          path="/home/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
