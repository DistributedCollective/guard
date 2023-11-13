import { PauserContract } from "./config/pauser";
import { PausedState } from "./state/shared";

export const flatten = (items: Array<Record<string, boolean>>): Record<string, boolean> => items.reduce((p, c) => ({...p, ...c }), {} as Record<string, boolean>);

export const toPausedState = (items: PauserContract[]): PausedState[] => items.reduce((p, c) => [...p, ...c.methods.map(m => ({ group: c.group, method: m.name, value: false }))], [] as PausedState[]);

export const findChanged = (initial: PausedState[], current: PausedState[]): PausedState[] => {
  return current.filter(item => {
    const i = initial.find(i => i.group === item.group && i.method === item.method)?.value || false;
    return i !== item.value;
  });
}


export const downloadAsJson = (content: string, fileName: string = 'proposal.json') => {
  var a = document.createElement("a");
  var file = new Blob([content], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};


export const distinctFilter = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;
