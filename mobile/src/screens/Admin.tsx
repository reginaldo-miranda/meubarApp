// admin/src/screens/Admin.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { saleService, Venda } from "../services/saleServices";

export default function Admin() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [funcionarioFiltro, setFuncionarioFiltro] = useState<string>("");
  const [clienteFiltro, setClienteFiltro] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [totalCaixa, setTotalCaixa] = useState<number>(0);

  const fetchVendas = async () => {
    setLoading(true);
    try {
      const data = await saleService.list({
        status: statusFiltro || undefined,
        funcionario: funcionarioFiltro || undefined,
        cliente: clienteFiltro || undefined,
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined,
      });
      setVendas(data);

      // Calcular total do caixa
      const total = data
        .filter((v) => v.status === "finalizada")
        .reduce((acc, v) => acc + (v.total || 0), 0);
      setTotalCaixa(total);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as vendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const finalizarVenda = async (vendaId: string) => {
    try {
      await saleService.finalize(vendaId, "dinheiro");
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível finalizar a venda");
    }
  };

  const cancelarVenda = async (vendaId: string) => {
    try {
      await saleService.cancel(vendaId);
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cancelar a venda");
    }
  };

  const renderItemVenda = ({ item }: { item: Venda }) => (
    <View style={styles.vendaCard}>
      <Text style={styles.titulo}>
        Mesa: {item.mesa || "Balcão"} - Funcionário: {item.funcionario.nome}
      </Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: R$ {item.total?.toFixed(2) || "0.00"}</Text>

      <Text style={styles.subtitulo}>Itens:</Text>
      {item.itens.map((i) => (
        <Text key={i.produto}>
          {i.nomeProduto} x {i.quantidade} = R$ {i.subtotal.toFixed(2)}
        </Text>
      ))}

      {item.status === "aberta" && (
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <Button title="Finalizar" onPress={() => finalizarVenda(item._id)} />
          <View style={{ width: 8 }} />
          <Button title="Cancelar" onPress={() => cancelarVenda(item._id)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Administração de Vendas</Text>

      {/* Filtros */}
      <View style={styles.filtros}>
        <TextInput
          style={styles.input}
          placeholder="Status (aberta, finalizada, cancelada)"
          value={statusFiltro}
          onChangeText={setStatusFiltro}
        />
        <TextInput
          style={styles.input}
          placeholder="Funcionário (ID)"
          value={funcionarioFiltro}
          onChangeText={setFuncionarioFiltro}
        />
        <TextInput
          style={styles.input}
          placeholder="Cliente (ID)"
          value={clienteFiltro}
          onChangeText={setClienteFiltro}
        />
        <TextInput
          style={styles.input}
          placeholder="Data Início (YYYY-MM-DD)"
          value={dataInicio}
          onChangeText={setDataInicio}
        />
        <TextInput
          style={styles.input}
          placeholder="Data Fim (YYYY-MM-DD)"
          value={dataFim}
          onChangeText={setDataFim}
        />
        <Button title="Filtrar" onPress={fetchVendas} />
      </View>

      {/* Resumo do caixa */}
      <Text style={styles.totalCaixa}>Total do Caixa: R$ {totalCaixa.toFixed(2)}</Text>

      <FlatList
        data={vendas}
        keyExtractor={(item) => item._id}
        renderItem={renderItemVenda}
        refreshing={loading}
        onRefresh={fetchVendas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  filtros: { marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 8, borderRadius: 4 },
  vendaCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: { fontSize: 18, fontWeight: "bold" },
  subtitulo: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  totalCaixa: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
});
