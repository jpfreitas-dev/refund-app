import { useState } from 'react';

import searchSvg from '../assets/search.svg';
import { CATEGORIES } from '../utils/categories';
import { formatCurrency } from '../utils/formatCurrency';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RefundItem, type RefundItemProps } from '../components/RefundItem';
import { Pagination } from '../components/Pagination';

const REFUND_EXAMPLE = {
  id: '1',
  name: 'João Paulo',
  category: 'Transporte',
  amount: formatCurrency(34.5),
  categoryImg: CATEGORIES['transport'].icon,
};

export function Dashboard() {
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);
  const [totalOfPages, _setTotalOfPages] = useState(10);
  const [refunds, _setRefunds] = useState<RefundItemProps[]>([REFUND_EXAMPLE]);

  function fetchRefunds(e: React.ChangeEvent) {
    e.preventDefault();
    console.log('fetching refunds with name:', name);
  }

  function handlePagination(action: 'next' | 'previous') {
    setPage((previousPage) => {
      if (action === 'next' && previousPage < totalOfPages) {
        return previousPage + 1;
      }

      if (action === 'previous' && previousPage > 1) {
        return previousPage - 1;
      }

      return previousPage;
    });
  }

  return (
    <div className="bg-gray-500 rounded-xl p-10 md:min-w-3xl">
      <h1 className="text-gray-100 font-bold text-xl flex-1">Solicitações</h1>

      <form
        onSubmit={fetchRefunds}
        className="flex flex-1 items-center justify-between pb-6 border-b border-b-gray-400 md:flex-row gap-2 mt-6"
      >
        <Input
          placeholder="Pesquisar pelo nome"
          onChange={(e) => setName(e.target.value)}
        />

        <Button variant="icon" type="submit">
          <img src={searchSvg} alt="Ícone de pesquisar" />
        </Button>
      </form>

      <div className="my-6 flex flex-col gap-4 max-h-85.5 overflow-y-scroll">
        {refunds.map((item) => (
          <RefundItem key={item.id} data={item} href={`/refund/${item.id}`} />
        ))}
      </div>

      <Pagination
        current={page}
        total={totalOfPages}
        onNext={() => handlePagination('next')}
        onPrevious={() => handlePagination('previous')}
      />
    </div>
  );
}
