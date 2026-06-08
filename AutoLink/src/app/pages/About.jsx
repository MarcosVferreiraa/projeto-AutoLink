import React from 'react';
import { Award, Users, ShieldCheck, TrendingUp } from 'lucide-react';
export function About() {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h1 className="text-4xl mb-4">Sobre a AutoLink</h1>
      <p className="text-xl text-muted-foreground">Há mais de 15 anos trazendo confiança e qualidade no mercado de seminovos</p>
      </div>{/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Award className="w-6 h-6 text-primary" />
          </div><p className="text-3xl mb-1">15+</p>
          <p className="text-muted-foreground">Anos de Mercado</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-primary" />
            </div><p className="text-3xl mb-1">5.000+</p>
            <p className="text-muted-foreground">Clientes Satisfeitos</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
              </div><p className="text-3xl mb-1">100%</p>
              <p className="text-muted-foreground">Garantia</p>
              </div><div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" /></div>
                <p className="text-3xl mb-1">300+</p>
                <p className="text-muted-foreground">Veículos/Ano</p></div>
                </div>{/* Story */}<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                  <div><h2 className="mb-4">Nossa História</h2>
                  <p className="text-muted-foreground mb-4">Fundada em 2011, a AutoLink nasceu com o objetivo de transformar a experiência de compra de carros seminovos no Brasil. Começamos com um pequeno estoque de 20 veículos e muito comprometimento com a satisfação do cliente.</p>
                  <p className="text-muted-foreground mb-4">Hoje, somos referência em São Paulo, com mais de 5.000 clientes satisfeitos e um estoque permanente de veículos de alta qualidade, todas marcas e modelos.</p>
                  <p className="text-muted-foreground">Nossa missão é oferecer veículos seminovos premium com total transparência, procedência garantida e condições de pagamento que cabem no seu bolso.</p>
                  </div>
                  <div>
                    <img src="https://images.unsplash.com/photo-1574023240744-64c47c8c0676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Nossa loja" className="w-full h-80 object-cover rounded-lg" />
                    </div>
                    </div>{/* Values */}<div>
                      <h2 className="text-center mb-8">Nossos Valores</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-card rounded-lg border border-border p-6"><h3 className="mb-3">Transparência</h3><p className="text-muted-foreground">Todas as informações sobre procedência, histórico e condições dos veículos são compartilhadas de forma clara e completa.</p></div><div className="bg-card rounded-lg border border-border p-6"><h3 className="mb-3">Qualidade</h3><p className="text-muted-foreground">Cada veículo passa por rigorosa inspeção técnica antes de entrar em nosso estoque. Garantimos apenas carros em excelente estado.</p></div><div className="bg-card rounded-lg border border-border p-6"><h3 className="mb-3">Compromisso</h3><p className="text-muted-foreground">Nosso relacionamento com o cliente não termina na venda. Oferecemos suporte completo e garantia em todos os veículos.</p></div></div></div></div>;
}