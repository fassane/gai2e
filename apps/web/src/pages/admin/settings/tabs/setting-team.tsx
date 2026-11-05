import { useState } from 'react';
import { LuUserPlus } from 'react-icons/lu';
import { Button, ColgateWrapper } from '@gai2e/ui';
import { InviteMemberModal } from '../modals/invite-member';
import TeamTable from '../tables/team-table';

const SettingTeam = () => {
  const [open, setOpen] = useState(false);

  return (
    <ColgateWrapper>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Équipe</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Conseillers et administrateurs ayant accès au back-office.
          </p>
        </div>
        <Button variant="cta" onClick={() => setOpen(true)}>
          <LuUserPlus />
          Inviter un membre
        </Button>
      </div>
      <TeamTable />
      <InviteMemberModal open={open} onOpenChange={setOpen} />
    </ColgateWrapper>
  );
};

export default SettingTeam;
