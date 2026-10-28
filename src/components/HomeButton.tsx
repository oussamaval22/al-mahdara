import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, shadow } from '../theme/colors';

type Props = {
  title: string;
  subtitle: string;
  icon: any;
  onPress: () => void;
  gold?: boolean;
};

export default function HomeButton({ title, subtitle, icon, onPress, gold }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={s.card}>
      <View style={[s.icon, gold && s.iconGold]}>
        <Ionicons name={icon} size={28} color={gold ? colors.goldDark : colors.green} />
      </View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: '47%', minHeight: 142, backgroundColor: colors.surface, borderRadius: 24,
    padding: 16, margin: '1.5%', alignItems: 'center', justifyContent: 'center', ...shadow.soft,
  },
  icon: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  iconGold: { backgroundColor: '#F6EFCF' },
  title: { color: colors.ink, fontSize: 17, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: colors.muted, fontSize: 11, marginTop: 4, textAlign: 'center' },
});
