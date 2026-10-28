import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY='@al_muhadhara_tasbih';
export async function getTasbihCount(){const v=await AsyncStorage.getItem(KEY);return v===null?0:Number(v)||0;}
export async function saveTasbihCount(n:number){await AsyncStorage.setItem(KEY,String(n));}
export async function resetTasbih(){await AsyncStorage.setItem(KEY,'0');}
