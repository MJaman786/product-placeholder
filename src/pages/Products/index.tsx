import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LazyLoadingWrapper from '../../common/LazyLoading';

const RenderProducts = lazy(() => import('../../components/Products'));
const MemoizedProducts = memo(RenderProducts);

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>Products Catalog — Product Hub</title>
        <meta name="description" content="Browse, search, filter, sort, and manage all products." />
      </Helmet>
      <LazyLoadingWrapper>
        <MemoizedProducts />
      </LazyLoadingWrapper>
    </>
  );
}
