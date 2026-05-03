"use client";

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LogOut, Calendar as CalendarIcon, Settings, Users, Home, X, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Modals State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  // Data State
  const [rooms, setRooms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Form states
  const [newRoom, setNewRoom] = useState({ name: '', cap: '', res: '' });
  const [newUser, setNewUser] = useState({ name: '', username: '', role: 'USER', password: '' });
  const [newBooking, setNewBooking] = useState({ title: '', roomId: '', start: '', end: '' });

  // Fetch initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
      fetchBookings();
      if (currentUser?.role === 'ADMIN') {
        fetchUsers();
      }
    }
  }, [isAuthenticated, currentUser]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      const formattedBookings = response.data.map((b: any) => ({
        id: b.id.toString(),
        title: `${b.title} - ${b.room.name}`,
        start: b.start_time,
        end: b.end_time,
        backgroundColor: b.userId === currentUser?.id ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.2)',
        borderColor: b.userId === currentUser?.id ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)',
        extendedProps: { ...b }
      }));
      setBookings(formattedBookings);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password
      });
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      setActiveTab('calendar');
    } catch (error) {
      alert('Usuário ou senha inválidos!');
    }
  };

  const handleSelectTime = (info: any) => {
    setNewBooking({
      ...newBooking,
      start: info.startStr,
      end: info.endStr,
      roomId: rooms.length > 0 ? rooms[0].id.toString() : ''
    });
    setIsBookingModalOpen(true);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBooking.title && newBooking.roomId) {
      try {
        await axios.post(`${API_URL}/bookings`, {
          title: newBooking.title,
          roomId: newBooking.roomId,
          userId: currentUser.id,
          start: newBooking.start,
          end: newBooking.end
        });
        fetchBookings();
        setIsBookingModalOpen(false);
        setNewBooking({ title: '', roomId: '', start: '', end: '' });
      } catch (error) {
        alert('Erro ao realizar reserva. Verifique se a sala está disponível.');
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Deseja excluir esta reserva?')) {
      try {
        await axios.delete(`${API_URL}/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert('Erro ao excluir reserva');
      }
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoom.name) {
      try {
        if (editingRoom) {
          await axios.put(`${API_URL}/rooms/${editingRoom.id}`, newRoom);
        } else {
          await axios.post(`${API_URL}/rooms`, {
            name: newRoom.name,
            capacity: newRoom.cap,
            res: newRoom.res
          });
        }
        fetchRooms();
        setIsRoomModalOpen(false);
        setEditingRoom(null);
        setNewRoom({ name: '', cap: '', res: '' });
      } catch (error) {
        alert('Erro ao salvar sala no banco de dados');
      }
    }
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setNewRoom({ name: room.name, cap: room.capacity.toString(), res: room.description || '' });
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await axios.delete(`${API_URL}/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        alert('Erro ao excluir sala');
      }
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.username) {
      try {
        if (editingUser) {
          await axios.put(`${API_URL}/users/${editingUser.id}`, newUser);
        } else {
          await axios.post(`${API_URL}/users`, newUser);
        }
        fetchUsers();
        setIsUserModalOpen(false);
        setEditingUser(null);
        setNewUser({ name: '', username: '', role: 'USER', password: '' });
      } catch (error) {
        alert('Erro ao salvar usuário no banco de dados');
      }
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setNewUser({ name: user.name, username: user.username, role: user.role, password: '' });
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Erro ao excluir usuário');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0A]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10 animation-fade-in border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 mb-4"><CalendarIcon size={32} /></div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SMGR</h1>
            <p className="text-zinc-400 mt-2 text-sm text-center">Sistema Moderno de Gestão de Reservas</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-sm font-medium text-zinc-300 mb-1">Usuário</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50" placeholder="admin" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label><input type="password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50" placeholder="admin" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-4 py-3 mt-4 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]">Entrar no Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col justify-between p-6 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"><CalendarIcon size={20} /></div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SMGR</h1>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('calendar')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <Home size={18} /><span className="font-medium">Painel de Reservas</span>
            </button>
            {currentUser?.role === 'ADMIN' && (
              <><button onClick={() => setActiveTab('rooms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'rooms' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                  <Settings size={18} /><span className="font-medium">Salas</span>
                </button>
                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                  <Users size={18} /><span className="font-medium">Usuários</span>
                </button></>
            )}
          </nav>
        </div>
        <div>
          <div className="mb-4 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Logado como</p>
            <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">{currentUser?.role}</span>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <LogOut size={18} /><span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === 'calendar' && (
            <div className="h-full flex flex-col animation-fade-in">
              <header className="mb-8"><h2 className="text-3xl font-bold mb-2">Painel de Reservas</h2><p className="text-zinc-400">Arraste para selecionar horários. Verde: livre. Vermelho: ocupado.</p></header>
              <div className="flex-1 glass-panel rounded-2xl p-6 border border-white/5 overflow-hidden shadow-2xl relative">
                <div className="h-full w-full calendar-container">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                    slotMinTime="07:00:00" slotMaxTime="22:00:00" allDaySlot={false} selectable={true} selectMirror={true} nowIndicator={true} editable={false}
                    events={bookings}
                    select={handleSelectTime}
                    eventClick={(info) => {
                       if (info.event.extendedProps.userId === currentUser.id || currentUser.role === 'ADMIN') {
                         handleDeleteBooking(info.event.id);
                       }
                    }}
                    height="100%" locale="pt-br" buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {(activeTab === 'rooms' && currentUser?.role === 'ADMIN') && (
            <div className="h-full animation-fade-in">
              <header className="mb-8 flex justify-between items-center">
                <div><h2 className="text-3xl font-bold mb-2">Gerenciar Salas</h2><p className="text-zinc-400">Cadastre e configure as salas disponíveis.</p></div>
                <button onClick={() => { setEditingRoom(null); setNewRoom({ name: '', cap: '', res: '' }); setIsRoomModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <Plus size={18} /> Nova Sala
                </button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="glass-panel p-6 rounded-2xl border border-white/5 relative group hover:border-primary/30 flex flex-col justify-between min-h-[160px]">
                    <div><div className={`absolute top-6 right-6 w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${room.is_active ? 'bg-green-500 text-green-500' : 'bg-zinc-600 text-zinc-600'}`} />
                      <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                      <div className="space-y-1 text-zinc-400 text-sm"><p><strong className="text-zinc-300">Capacidade:</strong> {room.capacity} pessoas</p><p><strong className="text-zinc-300">Recursos:</strong> {room.description}</p></div></div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditRoom(room)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all text-xs font-bold"><Edit2 size={14} /> Editar</button>
                      <button onClick={() => handleDeleteRoom(room.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-bold"><Trash2 size={14} /> Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'users' && currentUser?.role === 'ADMIN') && (
            <div className="h-full animation-fade-in">
               <header className="mb-8 flex justify-between items-center">
                <div><h2 className="text-3xl font-bold mb-2">Gerenciar Usuários</h2><p className="text-zinc-400">Controle de acesso e permissões.</p></div>
                <button onClick={() => { setEditingUser(null); setNewUser({ name: '', username: '', role: 'USER', password: '' }); setIsUserModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <Plus size={18} /> Novo Usuário
                </button>
              </header>
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr><th className="p-4 font-medium text-zinc-400">Nome</th><th className="p-4 font-medium text-zinc-400">Usuário</th><th className="p-4 font-medium text-zinc-400">Papel</th><th className="p-4 font-medium text-zinc-400">Ações</th></tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.username}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>{user.role}</span></td>
                        <td className="p-4"><div className="flex gap-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" onClick={() => handleEditUser(user)} title="Editar"><Edit2 size={18} /></button>
                          <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" onClick={() => handleDeleteUser(user.id)} title="Excluir"><Trash2 size={18} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animation-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 text-primary rounded-lg border border-primary/30"><CheckCircle size={20} /></div>
              <h3 className="text-xl font-bold">Reservar Sala</h3>
            </div>
            <form onSubmit={handleSaveBooking} className="space-y-4">
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Título/Finalidade</label><input type="text" required value={newBooking.title} onChange={e => setNewBooking({...newBooking, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" placeholder="ex: Reunião de Equipe" /></div>
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Selecione a Sala</label>
                <select required value={newBooking.roomId} onChange={e => setNewBooking({...newBooking, roomId: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 appearance-none">
                  <option value="">Selecione uma sala...</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name} ({room.capacity} pessoas)</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="block text-sm font-medium text-zinc-300 mb-1">Início</label><div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-zinc-400 text-xs">{new Date(newBooking.start).toLocaleString('pt-br')}</div></div>
                 <div><label className="block text-sm font-medium text-zinc-300 mb-1">Fim</label><div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-zinc-400 text-xs">{new Date(newBooking.end).toLocaleString('pt-br')}</div></div>
              </div>
              <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={() => setIsBookingModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button><button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)]">Confirmar Reserva</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Other Modals */}
      {isRoomModalOpen && currentUser?.role === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animation-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <button onClick={() => { setIsRoomModalOpen(false); setEditingRoom(null); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
            <h3 className="text-xl font-bold mb-6">{editingRoom ? 'Editar Sala' : 'Nova Sala'}</h3>
            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Nome da Sala</label><input type="text" required value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" /></div>
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Capacidade (pessoas)</label><input type="number" required value={newRoom.cap} onChange={e => setNewRoom({...newRoom, cap: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" /></div>
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Recursos (ex: TV, Projetor)</label><input type="text" value={newRoom.res} onChange={e => setNewRoom({...newRoom, res: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" /></div>
              <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={() => { setIsRoomModalOpen(false); setEditingRoom(null); }} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button><button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium">{editingRoom ? 'Salvar Alterações' : 'Salvar Sala'}</button></div>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && currentUser?.role === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animation-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <button onClick={() => { setIsUserModalOpen(false); setEditingUser(null); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
            <h3 className="text-xl font-bold mb-6">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Nome Completo</label><input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" /></div>
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Nome de Usuário (Login)</label><input type="text" required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" /></div>
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label><input type="password" required={!editingUser} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50" placeholder={editingUser ? 'Deixe em branco para manter' : 'Digite a senha'} /></div>
              <div><label className="block text-sm font-medium text-zinc-300 mb-1">Nível de Acesso</label><select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 appearance-none">
                  <option value="USER">Usuário Comum</option>
                  <option value="ADMIN">Administrador</option>
                </select></div>
              <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={() => { setIsUserModalOpen(false); setEditingUser(null); }} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button><button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium">{editingUser ? 'Salvar Alterações' : 'Criar Usuário'}</button></div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .calendar-container {
          --fc-border-color: rgba(255, 255, 255, 0.05); --fc-button-text-color: #fff; --fc-button-bg-color: rgba(255, 255, 255, 0.05); --fc-button-border-color: rgba(255, 255, 255, 0.1); --fc-button-hover-bg-color: rgba(255, 255, 255, 0.1); --fc-button-hover-border-color: rgba(255, 255, 255, 0.2); --fc-button-active-bg-color: rgba(59, 130, 246, 0.2); --fc-button-active-border-color: rgba(59, 130, 246, 0.5); --fc-event-bg-color: rgba(59, 130, 246, 0.2); --fc-event-border-color: rgb(59, 130, 246); --fc-today-bg-color: rgba(255, 255, 255, 0.02); --fc-page-bg-color: transparent;
        }
        .fc-theme-standard td, .fc-theme-standard th { border-color: var(--fc-border-color); }
        .fc-theme-standard .fc-scrollgrid { border-color: var(--fc-border-color); }
        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { color: #60a5fa; }
        .fc-col-header-cell-cushion { color: #a1a1aa; font-weight: 500; padding: 12px 0 !important; }
        .fc-timegrid-slot-label-cushion { color: #a1a1aa; }
        .animation-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
