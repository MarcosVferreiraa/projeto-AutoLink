
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  X,
  Users,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useProposals } from "../context/ProposalsContext";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

export function AdminProposals() {
  const { user, isAdmin } = useAuth();

  const {
    proposals,
    acceptProposal,
    rejectProposal,
  } = useProposals();

  const navigate = useNavigate();

  const [pendingAdmins, setPendingAdmins] =
    useState([]);

  async function loadPendingAdmins() {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "pending_admin")
      );

      const snapshot = await getDocs(q);

      const users = snapshot.docs.map(
        (docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        })
      );

      setPendingAdmins(users);
    } catch (error) {
      console.error(error);
    }
  }

  async function approveAdmin(userId) {
    try {
      await updateDoc(
        doc(db, "users", userId),
        {
          role: "admin",
          approved: true,
        }
      );

      setPendingAdmins((prev) =>
        prev.filter(
          (admin) => admin.id !== userId
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function rejectAdmin(userId) {
    try {
      await updateDoc(
        doc(db, "users", userId),
        {
          role: "user",
          approved: false,
        }
      );

      setPendingAdmins((prev) =>
        prev.filter(
          (admin) => admin.id !== userId
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }

    loadPendingAdmins();
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Clock className="w-3 h-3" />
            Aguardando
          </span>
        );

      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="w-3 h-3" />
            Aprovada
          </span>
        );

      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle className="w-3 h-3" />
            Recusada
          </span>
        );

      default:
        return null;
    }
  };

  const pendingCount = proposals.filter(
    (proposal) =>
      proposal.status === "pending"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />

            <h1 className="text-3xl font-bold tracking-tight">
              Gerenciar Propostas
            </h1>
          </div>

          <p className="text-muted-foreground">
            Painel de controlo do
            administrador para análise de
            propostas e pedidos de acesso.
          </p>
        </div>

        <Link
          to="/admin/usuarios"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-md font-medium transition-all shadow-sm text-sm"
        >
          <Users className="w-4 h-4" />
          Gerenciar Usuários
        </Link>
      </div>

      {/* PEDIDOS ADMIN */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-primary" />

          <h2 className="text-2xl">
            Pedidos de Administrador
          </h2>
        </div>

        {pendingAdmins.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">
              Nenhum pedido pendente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {admin.name}
                    </h3>

                    <p className="text-muted-foreground">
                      {admin.email}
                    </p>

                    {admin.phone && (
                      <p className="text-muted-foreground">
                        {admin.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        approveAdmin(admin.id)
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Aprovar
                    </button>

                    <button
                      onClick={() =>
                        rejectAdmin(admin.id)
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />

          <p className="text-2xl mb-1">
            {
              proposals.filter(
                (p) =>
                  p.status === "pending"
              ).length
            }
          </p>

          <p className="text-sm text-muted-foreground">
            Aguardando
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />

          <p className="text-2xl mb-1">
            {
              proposals.filter(
                (p) =>
                  p.status === "approved"
              ).length
            }
          </p>

          <p className="text-sm text-muted-foreground">
            Aprovadas
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />

          <p className="text-2xl mb-1">
            {
              proposals.filter(
                (p) =>
                  p.status === "rejected"
              ).length
            }
          </p>

          <p className="text-sm text-muted-foreground">
            Recusadas
          </p>
        </div>
      </div>

      {/* PROPOSTAS */}
      {proposals.length > 0 ? (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-card rounded-lg border border-border overflow-hidden shadow-sm"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-lg">
                      Proposta #
                      {proposal.id}
                    </span>

                    {getStatusBadge(
                      proposal.status
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Cliente:
                    <span className="text-foreground font-medium ml-1">
                      {proposal.userName}
                    </span>
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {proposal.userEmail}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {proposal.userPhone}
                  </p>

                  {proposal.message && (
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm italic">
                      "{proposal.message}"
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Veículo
                  </span>

                  <p className="font-medium">
                    {proposal.carBrand}
                    {" "}
                    {proposal.carModel}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Ano:
                    {" "}
                    {proposal.carYear}
                  </p>
                </div>

                <div className="md:text-right">
                  <span className="text-xs uppercase text-muted-foreground">
                    Valor Oferecido
                  </span>

                  <p className="text-2xl font-bold text-primary">
                    R$
                    {" "}
                    {Number(
                      proposal.price
                    ).toLocaleString(
                      "pt-BR"
                    )}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Tabela:
                    {" "}
                    R$
                    {" "}
                    {Number(
                      proposal.originalPrice
                    ).toLocaleString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-muted px-6 py-3 flex justify-between items-center flex-wrap gap-3 border-t border-border">
                <Link
                  to={`/carro/${proposal.carId}`}
                  className="px-4 py-2 border border-border bg-card rounded-md hover:bg-background transition-colors text-sm"
                >
                  Ver Carro
                </Link>

                {proposal.status ===
                  "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        acceptProposal(
                          proposal.id
                        )
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Aceitar
                    </button>

                    <button
                      onClick={() =>
                        rejectProposal(
                          proposal.id
                        )
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Recusar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />

          <h3 className="mb-2">
            Nenhuma proposta recebida
          </h3>

          <p className="text-muted-foreground">
            As propostas dos clientes
            aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
}

