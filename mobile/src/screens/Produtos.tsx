// admin/src/screens/Produtos.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
} from "react-native";
import { api } from "../services/api";

interface Produto {
  _id: string;
  nome: string;
  precoVenda: number;
  ativo: boolean;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const res = await api.get<Produto[]>("/products");
      setProdutos(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const abrirModalNovo = () => {
    setProdutoEditando(null);
    setNomeProduto("");
    setPrecoProduto("");
    setModalAberto(true);
  };

  const abrirModalEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setNomeProduto(produto.nome);
    setPrecoProduto(produto.precoVenda.toString());
    setModalAberto(true);
  };

  const salvarProduto = async () => {
    if (!nomeProduto || !precoProduto) {
      Alert.alert("Erro", "Nome e preço são obrigatórios");
      return;
    }

    try {
      if (produtoEditando) {
        // Editar produto
        await api.put(`/products/${produtoEditando._id}`, {
          nome: nomeProduto,
          precoVenda: parseFloat(precoProduto),
        });
      } else {
        // Criar produto
        await api.post("/products", {
          nome: nomeProduto,
          precoVenda: parseFloat(precoProduto),
          ativo: true,
        });
      }
      setModalAberto(false);
      fetchProdutos();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o produto");
    }
  };

  const toggleAtivo = async (produto: Produto) => {
    try {
      await api.put(`/products/${produto._id}`, {
        ativo: !produto.ativo,
      });
      fetchProdutos();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o status do produto");
    }
  };

  const renderItemProduto = ({ item }: { item: Produto }) => (
    <View style={styles.produtoCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nomeProduto}>{item.nome}</Text>
        <Text>Preço: R$ {item.precoVenda.toFixed(2)}</Text>
        <Text>Status: {item.ativo ? "Ativo" : "Inativo"}</Text>
      </View>
      <View style={styles.botoes}>
        <Button title="Editar" onPress={() => abrirModalEditar(item)} />
        <Switch value={item.ativo} onValueChange={() => toggleAtivo(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Produtos</Text>
      <Button title="Novo Produto" onPress={abrirModalNovo} />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item._id}
        renderItem={renderItemProduto}
        refreshing={loading}
        onRefresh={fetchProdutos}
      />

      {/* Modal de criação/edição */}
      <Modal visible={modalAberto} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>
              {produtoEditando ? "Editar Produto" : "Novo Produto"}
            </Text>
            <TextInput
              placeholder="Nome do Produto"
              style={styles.inputText}
              value={nomeProduto}
              onChangeText={setNomeProduto}
            />
            <TextInput
              placeholder="Preço"
              style={styles.inputText}
              keyboardType="decimal-pad"
              value={precoProduto}
              onChangeText={setPrecoProduto}
            />
            <Button title="Salvar" onPress={salvarProduto} />
            <Button title="Cancelar" onPress={() => setModalAberto(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  produtoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nomeProduto: { fontSize: 18, fontWeight: "bold" },
  botoes: { flexDirection: "row", alignItems: "center", gap: 8 },
  inputText: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  tituloModal: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
});
