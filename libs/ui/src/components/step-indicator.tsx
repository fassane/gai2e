import { Progress } from './progress';

// Progression d'un formulaire en plusieurs étapes
function StepIndicator({ tabs, index }: { tabs: string[]; index: number }) {
  const percent = Math.round(((index + 1) / tabs.length) * 100);

  return (
    <div className="space-y-3 py-5">
      <div className="flex items-center justify-between">
        <p className="font-heading font-semibold text-primary">
          Étape {index + 1} sur {tabs.length}
        </p>
        <p className="text-sm text-muted-foreground">{percent} % complété</p>
      </div>
      <Progress value={percent} />
    </div>
  );
}

export { StepIndicator };
