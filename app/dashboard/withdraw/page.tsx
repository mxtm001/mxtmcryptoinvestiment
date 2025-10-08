"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Clock,
  Shield,
  Building2,
  Smartphone,
  Wallet,
  CreditCard,
  Sparkles,
  Crown,
  Zap,
  TrendingUp,
  Lock,
  Gift,
} from "lucide-react"

export default function WithdrawPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState({ type: "success", message: "" })
  const [showTopUpModal, setShowTopUpModal] = useState(false)

  const balance = 54000 // R$ 54.000

  const [formData, setFormData] = useState({
    amount: "",
    method: "bank",
    // Bank Transfer
    bankName: "",
    accountNumber: "",
    accountName: "",
    swiftCode: "",
    // PIX
    pixKeyType: "cpf",
    pixKey: "",
    pixAccountHolder: "",
    // Crypto
    cryptoType: "bitcoin",
    walletAddress: "",
    // PayPal
    paypalEmail: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const amount = Number.parseFloat(formData.amount)

      if (amount < 100) {
        setModalMessage({
          type: "error",
          message: "O valor mínimo de retirada é R$ 100",
        })
        setShowModal(true)
        setLoading(false)
        return
      }

      if (amount > balance) {
        setModalMessage({
          type: "error",
          message: "Saldo insuficiente",
        })
        setShowModal(true)
        setLoading(false)
        return
      }

      // Simulate withdrawal processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show the fancy top-up modal
      setShowTopUpModal(true)
      setLoading(false)
    } catch (error) {
      setModalMessage({
        type: "error",
        message: "Ocorreu um erro. Por favor, tente novamente.",
      })
      setShowModal(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-white/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Retirada
            </h1>
            <p className="text-muted-foreground">Retire seus fundos com segurança</p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">R$ {balance.toLocaleString("pt-BR")}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Retirada Mínima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">R$ 100</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Processamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0%</div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Form */}
        <Card className="border-2 border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Solicitar Retirada
            </CardTitle>
            <CardDescription>Escolha seu método de pagamento preferido e insira os detalhes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Valor da Retirada (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Digite o valor"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="100"
                  step="0.01"
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">Disponível: R$ {balance.toLocaleString("pt-BR")}</p>
              </div>

              {/* Payment Method Tabs */}
              <Tabs
                defaultValue="bank"
                className="w-full"
                onValueChange={(value) => setFormData({ ...formData, method: value })}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="bank" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Banco
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    Cripto
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    PayPal
                  </TabsTrigger>
                </TabsList>

                {/* Bank Transfer */}
                <TabsContent value="bank" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Nome do Banco</Label>
                      <Input
                        id="bankName"
                        placeholder="Ex: Banco do Brasil"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Número da Conta</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Digite o número da conta"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Nome do Titular</Label>
                      <Input
                        id="accountName"
                        placeholder="Nome completo"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swiftCode">Código SWIFT/Agência</Label>
                      <Input
                        id="swiftCode"
                        placeholder="Código SWIFT ou número da agência"
                        value={formData.swiftCode}
                        onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* PIX */}
                <TabsContent value="pix" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pixKeyType">Tipo de Chave PIX</Label>
                      <Select
                        value={formData.pixKeyType}
                        onValueChange={(value) => setFormData({ ...formData, pixKeyType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="random">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixKey">Chave PIX</Label>
                      <Input
                        id="pixKey"
                        placeholder={
                          formData.pixKeyType === "cpf"
                            ? "000.000.000-00"
                            : formData.pixKeyType === "cnpj"
                              ? "00.000.000/0000-00"
                              : formData.pixKeyType === "email"
                                ? "seu@email.com"
                                : formData.pixKeyType === "phone"
                                  ? "+55 (00) 00000-0000"
                                  : "Sua chave aleatória"
                        }
                        value={formData.pixKey}
                        onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixAccountHolder">Nome do Titular</Label>
                      <Input
                        id="pixAccountHolder"
                        placeholder="Nome completo do titular da conta"
                        value={formData.pixAccountHolder}
                        onChange={(e) => setFormData({ ...formData, pixAccountHolder: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      O PIX é instantâneo! Você receberá seus fundos em até 5 minutos.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* Cryptocurrency */}
                <TabsContent value="crypto" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cryptoType">Tipo de Criptomoeda</Label>
                      <Select
                        value={formData.cryptoType}
                        onValueChange={(value) => setFormData({ ...formData, cryptoType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdt">Tether (USDT)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Endereço da Carteira</Label>
                      <Input
                        id="walletAddress"
                        placeholder="Digite o endereço da sua carteira"
                        value={formData.walletAddress}
                        onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                        required
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  <Alert className="bg-orange-50 border-orange-200">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Verifique cuidadosamente o endereço da carteira. Transações de criptomoedas são irreversíveis.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* PayPal */}
                <TabsContent value="paypal" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">E-mail do PayPal</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.paypalEmail}
                      onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                      required
                    />
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Certifique-se de que este e-mail esteja vinculado à sua conta PayPal verificada.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Solicitar Retirada
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Tempos de Processamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transferência Bancária:</span>
                <span className="font-semibold">1-3 dias úteis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PIX:</span>
                <span className="font-semibold">Instantâneo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criptomoeda:</span>
                <span className="font-semibold">10-30 minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PayPal:</span>
                <span className="font-semibold">1-2 horas</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Limites de Retirada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mínimo:</span>
                <span className="font-semibold">R$ 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Máximo Diário:</span>
                <span className="font-semibold">R$ 100.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa:</span>
                <span className="font-semibold text-green-600">R$ 0 (Grátis)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Standard Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalMessage.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              {modalMessage.type === "success" ? "Sucesso" : "Erro"}
            </DialogTitle>
          </DialogHeader>
          <p>{modalMessage.message}</p>
          <Button onClick={() => setShowModal(false)}>Fechar</Button>
        </DialogContent>
      </Dialog>

      {/* Premium Top-Up Modal */}
      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent className="max-w-xl p-0 overflow-hidden border-none bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 p-6 space-y-4">
            {/* Premium Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-2 animate-bounce">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Atualize Sua Conta VIP</h2>
              <p className="text-sm text-blue-200">Desbloqueie retiradas ilimitadas e recursos premium</p>
            </div>

            {/* Status Alert */}
            <Alert className="bg-red-500/20 border-red-500/50 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-sm text-red-200">
                <strong>Status da Retirada:</strong> Ativação necessária para processar sua solicitação de retirada
              </AlertDescription>
            </Alert>

            {/* Premium Package Card */}
            <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    Pacote VIP Premium
                  </h3>
                  <p className="text-xs text-yellow-200">Taxa de ativação única</p>
                </div>
              </div>

              <div className="text-center py-2">
                <div className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-2">
                  <span className="text-2xl">R$</span>
                  2.000
                </div>
                <p className="text-xs text-yellow-200 mt-1">Taxa de ativação única</p>
              </div>

              <div className="bg-black/30 rounded-lg p-3 space-y-2">
                <p className="text-base text-white font-semibold text-center">Libera: R$ 54.000</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 text-center">
                    <Zap className="h-4 w-4 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-green-200">Processamento Instantâneo</p>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2 text-center">
                    <Shield className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-blue-200">100% Seguro</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Benefits */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Gift className="h-4 w-4 text-yellow-400" />
                Benefícios VIP Incluídos:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: TrendingUp, text: "Retiradas Ilimitadas" },
                  { icon: Zap, text: "Processamento Prioritário" },
                  { icon: Lock, text: "Segurança Máxima" },
                  { icon: Crown, text: "Status VIP Vitalício" },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10"
                  >
                    <benefit.icon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                    <span className="text-xs text-white">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => router.push("/dashboard/deposit")}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-4 text-base shadow-xl shadow-orange-500/50 border-0"
            >
              <Crown className="mr-2 h-5 w-5" />
              Ativar Conta VIP Agora
            </Button>

            {/* Footer Note */}
            <p className="text-xs text-center text-blue-200">
              🔒 Pagamento seguro • ⚡ Ativação instantânea • 💎 Acesso vitalício
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
