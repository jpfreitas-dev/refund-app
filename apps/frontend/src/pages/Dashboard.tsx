import { useState, useEffect } from 'react';

import { api } from '../services/api';
import { AxiosError } from 'axios';

import searchSvg from '../assets/search.svg';
import { CATEGORIES } from '../utils/categories';
import { formatCurrency } from '../utils/formatCurrency';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RefundItem, type RefundItemProps } from '../components/RefundItem';
import { Pagination } from '../components/Pagination';

const PER_PAGE = 2;

export function Dashboard() {
  const [nameInput, setNameInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalOfPages, _setTotalOfPages] = useState(0);
  const [refunds, _setRefunds] = useState<RefundItemProps[]>([]);

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    setSearchQuery(nameInput.trim());
    setPage(1);
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

  useEffect(() => {
    async function fetchRefunds() {
      try {
        setErrorMessage(null);

        const response = await api.get<RefundsPaginationAPIResponse>(
          `/refunds?name=${searchQuery}&page=${page}&perPage=${PER_PAGE}`,
        );

        _setRefunds(
          response.data.refunds.map((refund) => ({
            id: refund.id,
            name: refund.user.name,
            description: refund.name,
            amount: formatCurrency(refund.amount),
            categoryImg: CATEGORIES[refund.category].icon,
          })),
        );

        _setTotalOfPages(response.data.pagination.totalPages);
      } catch (error) {
        if (error instanceof AxiosError) {
          return setErrorMessage(
            error.response?.data.message ||
              'Ocorreu um erro ao buscar as solicitações',
          );
        }

        setErrorMessage('Ocorreu um erro ao buscar as solicitações');
      }
    }

    fetchRefunds();
  }, [searchQuery, page]);

  return (
    <div className="bg-gray-500 rounded-xl p-10 md:min-w-3xl">
      <h1 className="text-gray-100 font-bold text-xl flex-1">Solicitações</h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 items-center justify-between pb-6 border-b border-b-gray-400 md:flex-row gap-2 mt-6"
      >
        <Input
          placeholder="Pesquisar pelo nome"
          onChange={(e) => setNameInput(e.target.value)}
        />

        <Button variant="icon" type="submit">
          <img src={searchSvg} alt="Ícone de pesquisar" />
        </Button>
      </form>

      {errorMessage && (
        <p className="text-sm text-red-600 text-center font-medium my-4">
          {errorMessage}
        </p>
      )}

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
