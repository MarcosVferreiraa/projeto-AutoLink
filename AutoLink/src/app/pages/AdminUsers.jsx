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
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const filteredUsers = usersList.filter((account) => {
    const age = calculateAge(account.birthDate);

    const matchesName =
      !nameFilter ||
      (account.name || "")
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

    const matchesRole =
      !roleFilter || account.role === roleFilter;

    let matchesAge = true;

    if (ageFilter === "18-25") {
      matchesAge = age >= 18 && age <= 25;
    } else if (ageFilter === "26-35") {
      matchesAge = age >= 26 && age <= 35;
    } else if (ageFilter === "36-50") {
      matchesAge = age >= 36 && age <= 50;
    } else if (ageFilter === "51+") {
      matchesAge = age >= 51;
    }

    return matchesName && matchesRole && matchesAge;
  });
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

      <div className="users-filters">
        <input
          type="text"
          placeholder="Pesquisar nome..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Todos os perfis</option>
          <option value="user">Utilizadores</option>
          <option value="admin">Administradores</option>
        </select>

        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        >
          <option value="">Todas as idades</option>
          <option value="18-25">18 - 25 anos</option>
          <option value="26-35">26 - 35 anos</option>
          <option value="36-50">36 - 50 anos</option>
          <option value="51+">51+ anos</option>
        </select>
      </div>

      <div className="user-grid">
        {filteredUsers.map((account) => (
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
              {account.birthDate && (
                <div className="user-info-row">
                  <Users size={16} />
                  {calculateAge(account.birthDate)} anos ({account.birthDate})
                </div>
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