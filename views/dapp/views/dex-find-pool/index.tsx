import { getAddress } from 'ethers/lib/utils';
import { useTranslations } from 'next-intl';
import { pathOr } from 'ramda';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Container } from '@/components';
import { ERC_20_DATA } from '@/constants';
import { Box, Typography } from '@/elements';
import { useGetDexAllowancesAndBalances, useIdAccount } from '@/hooks';
import { TOKEN_SYMBOL, ZERO_ADDRESS, ZERO_BIG_NUMBER } from '@/sdk';
import { TimesSVG } from '@/svg';

import GoBack from '../../components/go-back';
import { OnSelectCurrencyData } from '../dex/swap/swap.types';
import CreatePool from './create-pool';
import { DexFindPoolForm } from './dex-find-pool.types';
import FindPool from './find-pool';
import FindPoolButton from './find-pool-button';

const FindPoolView = () => {
  const { chainId, account } = useIdAccount();
  const t = useTranslations();
  const [isCreatingPair, setCreatingPair] = useState(false);
  const [isTokenAOpenModal, setTokenAIsOpenModal] = useState(false);
  const [isTokenBOpenModal, setTokenBIsOpenModal] = useState(false);

  const { setValue, control, getValues, register } = useForm<DexFindPoolForm>({
    defaultValues: {
      tokenA: {
        address: ERC_20_DATA[chainId][TOKEN_SYMBOL.INT].address,
        decimals: ERC_20_DATA[chainId][TOKEN_SYMBOL.INT].decimals,
        symbol: ERC_20_DATA[chainId][TOKEN_SYMBOL.INT].symbol,
      },
      tokenB: {
        address: ERC_20_DATA[chainId][TOKEN_SYMBOL.BTC].address,
        decimals: ERC_20_DATA[chainId][TOKEN_SYMBOL.BTC].decimals,
        symbol: ERC_20_DATA[chainId][TOKEN_SYMBOL.BTC].symbol,
      },
      isStable: false,
    },
  });

  // We want the form to re-render if addresses change
  const tokenAAddress = useWatch({ control, name: 'tokenA.address' });
  const isStable = useWatch({ control, name: 'isStable' });
  const tokenBAddress = useWatch({ control, name: 'tokenB.address' });

  const { balancesError, balancesData, nativeBalance, refetch } =
    useGetDexAllowancesAndBalances(
      chainId,
      tokenAAddress || ZERO_ADDRESS,
      tokenBAddress || ZERO_ADDRESS
    );

  const tokenANeedsAllowance = pathOr(
    ZERO_BIG_NUMBER,
    [getAddress(tokenAAddress), 'allowance'],
    balancesData
  ).isZero();

  const tokenBNeedsAllowance = pathOr(
    ZERO_BIG_NUMBER,
    [getAddress(tokenBAddress), 'allowance'],
    balancesData
  ).isZero();

  const onSelectCurrency =
    (name: 'tokenA' | 'tokenB') =>
    ({ address, decimals, symbol }: OnSelectCurrencyData) => {
      setValue(`${name}.address`, address);
      setValue(`${name}.decimals`, decimals);
      setValue(`${name}.symbol`, symbol);
      setValue('tokenA.value', '0.0');
      setValue('tokenB.value', '0.0');
      setTokenAIsOpenModal(false);
      setTokenBIsOpenModal(false);
      setCreatingPair(false);
    };

  if (balancesError)
    return (
      <Container py="XXL">
        <Box textAlign="center">
          <Box color="error">
            <TimesSVG width="10rem" />
          </Box>
          {t('dexPoolFind.balanceError')}
        </Box>
      </Container>
    );

  return (
    <Container py="XL" dapp>
      <GoBack routeBack />
      <Typography variant="normal" width="100%">
        {t('dexPoolFind.title')}
      </Typography>
      <FindPool
        control={control}
        setValue={setValue}
        currencyASelectArgs={{
          isModalOpen: isTokenAOpenModal,
          symbol: getValues('tokenA.symbol'),
          address: getValues('tokenA.address'),
          setIsModalOpen: setTokenAIsOpenModal,
          onSelectCurrency: onSelectCurrency('tokenA'),
        }}
        currencyBSelectArgs={{
          isModalOpen: isTokenBOpenModal,
          symbol: getValues('tokenB.symbol'),
          address: getValues('tokenB.address'),
          setIsModalOpen: setTokenBIsOpenModal,
          onSelectCurrency: onSelectCurrency('tokenB'),
        }}
        setCreatingPair={setCreatingPair}
      />
      {isCreatingPair && (
        <CreatePool
          getValues={getValues}
          tokenBalances={[
            pathOr(
              ZERO_BIG_NUMBER,
              [getAddress(tokenAAddress), 'balance'],
              balancesData
            ),
            pathOr(
              ZERO_BIG_NUMBER,
              [getAddress(tokenBAddress), 'balance'],
              balancesData
            ),
          ]}
          control={control}
          register={register}
          needAllowance={[tokenANeedsAllowance, tokenBNeedsAllowance]}
          setValue={setValue}
          refetch={refetch}
        />
      )}
      <FindPoolButton
        chainId={chainId}
        account={account}
        control={control}
        getValues={getValues}
        tokenAAddress={tokenAAddress}
        tokenBAddress={tokenBAddress}
        isStable={isStable}
        nativeBalance={nativeBalance}
        balancesData={balancesData}
        setCreatingPair={setCreatingPair}
        isCreatingPair={isCreatingPair}
      />
    </Container>
  );
};

export default FindPoolView;
