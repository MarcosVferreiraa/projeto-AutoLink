import { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Users, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { formatPhoneByThreeDigits } from '../utils/phone';
import './AdminUsers.css';

export function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [processingUserId, setProcessingUserId] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const snapshot = await getDocs(collection(db, 'users'));
      setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error);
      alert('Não foi possível carregar os utilizadores.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleToggleAdmin = async (account) => {
    const isSelf = account.uid === user?.uid || account.id === user?.uid;
    const newRole = account.role === 'admin' ? 'user' : 'admin';

    if (isSelf && newRole === 'user') {
      alert('Não podes remover o teu próprio acesso de administrador nesta sessão.');
      return;
    }

    try {
      setProcessingUserId(account.id);
      await updateDoc(doc(db, 'users', account.id), { role: newRole });
      setUsersList(prev => prev.map(u => u.id === account.id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Erro ao atualizar papel do utilizador:', error);
      alert('Não foi possível atualizar o papel do utilizador.');
    } finally {
      setProcessingUserId("");
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (id === user?.uid) {
      alert('Não podes apagar o teu próprio utilizador aqui.');
      return;
    }

    if (window.confirm(`Apagar ${email}?`)) {
      try {
        setProcessingUserId(id);
        await deleteDoc(doc(db, 'users', id));
        setUsersList(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error('Erro ao apagar utilizador:', error);
        alert('Não foi possível apagar o utilizador.');
      } finally {
        setProcessingUserId("");
      }
    }
  };

  return (
    <div className="admin-users-container">
      <h1>Gestão de Utilizadores</h1>
      {isLoadingUsers && <p>A carregar utilizadores...</p>}
      <div className="user-grid">
        {usersList.map((account) => (
          <div key={account.id} className="user-card">
            <div className="user-card-header">
              <h3>{account.name || "Sem nome"}</h3>
              <span className={`role-badge ${account.role}`}>{account.role}</span>
            </div>
            <div className="user-info">
              <div className="user-info-row"><Mail size={16} /> {account.email}</div>
              {(account.phone || account.phoneNumber) && (
                <div className="user-info-row"><Phone size={16} /> {formatPhoneByThreeDigits(account.phone || account.phoneNumber)}</div>
              )}
            </div>
            <div className="user-card-footer">
              <button
                onClick={() => handleToggleAdmin(account)}
                className="btn-user-action"
                disabled={processingUserId === account.id}
              >
                <ShieldAlert size={14} /> {account.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
              </button>
              <button
                onClick={() => handleDeleteUser(account.id, account.email)}
                className="btn-user-action"
                disabled={processingUserId === account.id}
              >
                <Trash2 size={14} /> Apagar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}