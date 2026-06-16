import { useState, useEffect } from 'react';
import { Shield, Trash2, Users, Mail, Phone, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router'; // CORRIGIDO: Limpo e usando o pacote correto único do router
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [user, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsersList(usersData);
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (targetUser) => {
    if (targetUser.email === "admin@teste.com" || targetUser.email === "admin@stand.com") {
      alert("Não é possível alterar as permissões do Administrador Geral de testes.");
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = `Deseja alterar o cargo de ${targetUser.name} para ${newRole === 'admin' ? 'Administrador' : 'Cliente'}?`;

    if (window.confirm(confirmMsg)) {
      try {
        const userRef = doc(db, 'users', targetUser.id);
        await updateDoc(userRef, { role: newRole });
        
        setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
        alert("Cargo atualizado com sucesso no Firebase!");
      } catch (error) {
        console.error("Erro ao atualizar cargo:", error);
        alert("Erro ao atualizar permissões no banco de dados.");
      }
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === "admin@teste.com" || userEmail === "admin@stand.com") {
      alert("Operação negada! Não pode apagar o Administrador Geral.");
      return;
    }

    if (window.confirm(`Tem certeza absoluta que deseja apagar a conta de ${userEmail}?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsersList(prev => prev.filter(u => u.id !== userId));
        alert("Perfil removido com sucesso!");
      } catch (error) {
        console.error("Erro ao apagar utilizador:", error);
        alert("Não foi possível excluir este perfil.");
      }
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* CABEÇALHO DO PAINEL DE USUÁRIOS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Controle de Membros e Permissões</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie permissões do Firebase em tempo real. Promova clientes a administradores ou remova contas.
          </p>
        </div>
        
        {/* BOTÃO PARA VOLTAR PARA A PÁGINA DE PROPOSTAS */}
        <Link
          to="/admin/propostas"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-muted text-foreground rounded-md font-medium transition-colors shadow-sm text-sm"
        >
          <Shield className="w-4 h-4" />
          Ver Propostas
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">A carregar utilizadores do Firebase...</div>
      ) : usersList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersList.map((account) => (
            <div 
              key={account.id} 
              className="bg-card rounded-lg border border-border p-6 shadow-sm flex flex-col justify-between space-y-4 animate-in fade-in-50"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{account.name || "Sem nome registado"}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      account.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {account.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </div>
                  {account.role === 'admin' && <Shield className="w-5 h-5 text-purple-600" />}
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground/70" />
                    <span className="truncate">{account.email}</span>
                  </div>
                  {account.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground/70" />
                      <span>{account.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-between gap-2">
                <button
                  onClick={() => handleToggleAdmin(account)}
                  disabled={account.email === "admin@teste.com" || account.email === "admin@stand.com"}
                  className="px-2 py-1.5 border border-border bg-background hover:bg-muted text-foreground rounded-md transition-colors text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />
                  {account.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                </button>

                <button
                  onClick={() => handleDeleteUser(account.id, account.email)}
                  disabled={account.email === "admin@teste.com" || account.email === "admin@stand.com"}
                  className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Apagar Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3>Nenhum usuário localizado no Firestore</h3>
        </div>
      )}
    </div>
  );
}