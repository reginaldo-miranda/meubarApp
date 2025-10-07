/*import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button } from "react-native";
import { saleService } from "../services/saleServices";




interface ItemVenda {
  produto: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

interface Venda {
  _id: string;
  mesa?: string;
  funcionario: { nome: string };
  cliente?: { nome: string };
  itens: ItemVenda[];
  status: string;
  total?: number;
}

export default function Mesas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);

 const fetchVendas = async () => {
  setLoading(true);
  try {
    const data: Venda[] = await saleService.getOpen();
    setVendas(data);
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
      await saleService.finalize(vendaId, "dinheiro"); // Pode adaptar a forma de pagamento
      Alert.alert("Sucesso", "Venda finalizada!");
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível finalizar a venda");
    }
  };

  const renderItem = ({ item }: { item: Venda }) => (
    <View style={styles.vendaCard}>
      <Text style={styles.titulo}>
        Mesa: {item.mesa || "Balcão"} - Funcionário: {item.funcionario.nome}
      </Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: R$ {item.total?.toFixed(2) || 0}</Text>
      <FlatList
        data={item.itens}
        keyExtractor={(i) => i.produto.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.nomeProduto} x {item.quantidade} = R$ {item.subtotal.toFixed(2)}
          </Text>
        )}
      />
      {item.status === "aberta" && (
        <Button title="Finalizar Venda" onPress={() => finalizarVenda(item._id)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vendas Abertas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchVendas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  vendaCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: { fontSize: 18, fontWeight: "bold" },
});
*/



/*
// mobile/src/screens/Mesas.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { saleService, Venda } from "../services/saleServices";

export default function Mesas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVendas = async () => {
    setLoading(true);
    try {
      const data = await saleService.getOpen();
      setVendas(data);
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
      await saleService.finalize(vendaId, "dinheiro"); // Forma de pagamento fixa por enquanto
      Alert.alert("Sucesso", "Venda finalizada!");
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível finalizar a venda");
    }
  };

  const renderItem = ({ item }: { item: Venda }) => (
    <View style={styles.vendaCard}>
      <Text style={styles.titulo}>
        Mesa: {item.mesa || "Balcão"} - Funcionário: {item.funcionario.nome}
      </Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: R$ {item.total?.toFixed(2) || "0.00"}</Text>
      <FlatList
        data={item.itens}
        keyExtractor={(i) => i.produto}
        renderItem={({ item }) => (
          <Text>
            {item.nomeProduto} x {item.quantidade} = R$ {item.subtotal.toFixed(2)}
          </Text>
        )}
      />
      {item.status === "aberta" && (
        <Button title="Finalizar Venda" onPress={() => finalizarVenda(item._id)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vendas Abertas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchVendas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  vendaCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: { fontSize: 18, fontWeight: "bold" },
});
*/
// mobile/src/screens/Mesas.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Picker,
} from "react-native";
import { saleService, Venda, ItemVenda } from "../services/saleServices";
import { api } from "../services/api";

interface Produto {
  _id: string;
  nome: string;
  precoVenda: number;
  ativo: boolean;
}

export default function Mesas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantidade, setQuantidade] = useState<{ [key: string]: number }>({});
  const [modalNovaVenda, setModalNovaVenda] = useState(false);
  const [novaVendaTipo, setNovaVendaTipo] = useState<"mesa" | "balcao">("balcao");
  const [novaVendaMesa, setNovaVendaMesa] = useState<string>("");
  const [novaVendaFuncionario, setNovaVendaFuncionario] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "cartao" | "pix">("dinheiro");

  // Buscar vendas abertas
  const fetchVendas = async () => {
    setLoading(true);
    try {
      const data = await saleService.getOpen();
      setVendas(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as vendas");
    } finally {
      setLoading(false);
    }
  };

  // Buscar produtos ativos
  const fetchProdutos = async () => {
    try {
      const res = await api.get<Produto[]>("/products");
      setProdutos(res.data.filter((p) => p.ativo));
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os produtos");
    }
  };

  useEffect(() => {
    fetchVendas();
    fetchProdutos();
  }, []);

  // Criar nova venda
  const criarVenda = async () => {
    if (!novaVendaFuncionario) {
      Alert.alert("Erro", "Informe o funcionário");
      return;
    }

    try {
      await saleService.create({
        funcionario: novaVendaFuncionario,
        tipoVenda: novaVendaTipo,
        mesa: novaVendaTipo === "mesa" ? novaVendaMesa : undefined,
      });
      Alert.alert("Sucesso", "Venda criada!");
      setModalNovaVenda(false);
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível criar a venda");
    }
  };

  // Adicionar item à venda
  const adicionarItem = async (vendaId: string, produtoId: string) => {
    const qtd = quantidade[produtoId] || 1;
    try {
      await saleService.addItem(vendaId, produtoId, qtd);
      setQuantidade({ ...quantidade, [produtoId]: 1 });
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível adicionar o item");
    }
  };

  // Remover item
  const removerItem = async (vendaId: string, produtoId: string) => {
    try {
      await saleService.removeItem(vendaId, produtoId);
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível remover o item");
    }
  };

  // Finalizar venda
  const finalizarVenda = async (vendaId: string) => {
    try {
      await saleService.finalize(vendaId, formaPagamento);
      Alert.alert("Sucesso", "Venda finalizada!");
      fetchVendas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível finalizar a venda");
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
      <FlatList
        data={item.itens}
        keyExtractor={(i) => i.produto}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>
              {item.nomeProduto} x {item.quantidade} = R$ {item.subtotal.toFixed(2)}
            </Text>
            <Button title="Remover" onPress={() => removerItem(item._id, item.produto)} />
          </View>
        )}
      />

      <Text style={styles.subtitulo}>Adicionar Produto:</Text>
      {produtos.map((p) => (
        <View key={p._id} style={styles.itemRow}>
          <Text>
            {p.nome} - R$ {p.precoVenda}
          </Text>
          <TextInput
            style={styles.inputQtd}
            keyboardType="number-pad"
            value={(quantidade[p._id] || 1).toString()}
            onChangeText={(text) =>
              setQuantidade({ ...quantidade, [p._id]: parseInt(text) || 1 })
            }
          />
          <Button title="Adicionar" onPress={() => adicionarItem(item._id, p._id)} />
        </View>
      ))}

      {item.status === "aberta" && (
        <>
          <Text style={styles.subtitulo}>Forma de pagamento:</Text>
          <Picker
            selectedValue={formaPagamento}
            onValueChange={(val) => setFormaPagamento(val)}
            style={{ height: 40, width: 150 }}
          >
            <Picker.Item label="Dinheiro" value="dinheiro" />
            <Picker.Item label="Cartão" value="cartao" />
            <Picker.Item label="Pix" value="pix" />
          </Picker>
          <Button title="Finalizar Venda" onPress={() => finalizarVenda(item._id)} />
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vendas Abertas</Text>
      <Button title="Nova Venda" onPress={() => setModalNovaVenda(true)} />
      <FlatList
        data={vendas}
        keyExtractor={(item) => item._id}
        renderItem={renderItemVenda}
        refreshing={loading}
        onRefresh={fetchVendas}
      />

      {/* Modal para nova venda */}
      <Modal visible={modalNovaVenda} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.titulo}>Nova Venda</Text>
            <Text>Tipo de Venda:</Text>
            <Picker
              selectedValue={novaVendaTipo}
              onValueChange={(val) => setNovaVendaTipo(val)}
              style={{ height: 40, width: 150 }}
            >
              <Picker.Item label="Balcão" value="balcao" />
              <Picker.Item label="Mesa" value="mesa" />
            </Picker>

            {novaVendaTipo === "mesa" && (
              <TextInput
                placeholder="Número da mesa"
                style={styles.inputText}
                value={novaVendaMesa}
                onChangeText={setNovaVendaMesa}
              />
            )}

            <TextInput
              placeholder="ID do Funcionário"
              style={styles.inputText}
              value={novaVendaFuncionario}
              onChangeText={setNovaVendaFuncionario}
            />

            <Button title="Criar Venda" onPress={criarVenda} />
            <Button title="Cancelar" onPress={() => setModalNovaVenda(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
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
  itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 4 },
  inputQtd: { borderWidth: 1, borderColor: "#ccc", width: 50, height: 30, textAlign: "center", marginHorizontal: 8 },
  inputText: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 8, borderRadius: 4 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 8, width: "80%" },
});
