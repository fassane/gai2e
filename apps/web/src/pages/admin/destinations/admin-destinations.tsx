import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { Button, ColgateWrapper, TopTitle } from '@gai2e/ui';
import { DestinationModal } from './modals/destination-modal';
import DestinationsTable from './tables/destinations-table';

const AdminDestinations = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <TopTitle
          title="Destinations"
          paragraph="Les pays et leurs procédures, tels qu'ils apparaissent sur le site."
          wrapperClassName="mb-0"
        />
        <Button variant="cta" onClick={() => setOpen(true)}>
          <LuPlus />
          Ajouter une destination
        </Button>
      </div>
      <ColgateWrapper>
        <DestinationsTable />
      </ColgateWrapper>
      <DestinationModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default AdminDestinations;
