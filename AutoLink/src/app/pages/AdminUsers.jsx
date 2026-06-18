import { useState, useEffect } from 'react';
import { Shield, Trash2, Users, Mail, Phone, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router'; 
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import './AdminUsers.css'; // ← Importação do CSS separado

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
    try {
      const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', targetUser.id), {
        role: newRole
      });
      
      setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Erro ao alterar cargo do utilizador:", error);
      alert("Erro ao alterar cargo.");
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Tem a certeza que deseja apagar permanentemente o perfil de ${userEmail}?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsersList(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Erro ao apagar utilizador:", error);
        alert("Erro ao apagar utilizador do Firestore.");
      }
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1>Gerenciar Usuários</h1>
        <Link to="/admin/propostas" className="proposals-link">
          <Shield className="w-4 h-4" />
          Painel de Propostas
        </Link>
      </div>

      {loading ? (
        <div className="admin-users-loading">
          Carregando lista de utilizadores...
        </div>
      ) : usersList.length > 0 ? (
        <div className="users-grid">
          {usersList.map((account) => (
            <div key={account.id} className="user-card">
              <div className="user-card-content">
                <div className="user-card-header">
                  <h3 className="user-name">{account.name || 'Sem nome'}</h3>
                  
                  {account.role === 'admin' ? (
                    <span className="role-badge admin">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="role-badge user">
                      Cliente
                    </span>
                  )}
                </div>

                <div className="user-info-row">
                  <Mail className="w-4 h-4" />
                  <span>{account.email}</span>
                </div>

                {account.phoneNumber && (
                  <div className="user-info-row">
                    <Phone className="w-4 h-4" />
                    <span>{account.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div className="user-card-footer">
                <button
                  onClick={() => handleToggleAdmin(account)}
                  disabled={account.email === "admin@teste.com" || account.email === "admin@stand.com"}
                  className="btn-toggle-admin"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />
                  {account.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                </button>

                <button
                  onClick={() => handleDeleteUser(account.id, account.email)}
                  disabled={account.email === "admin@teste.com" || account.email === "admin@stand.com"}
                  className="btn-delete-user"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Apagar Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-users-state">
          <Users className="empty-users-icon" />
          <h3>Nenhum usuário encontrado</h3>
          <p>Não existem contas registadas no banco de dados de momento.</p>
        </div>
      )}
    </div>
  );
}