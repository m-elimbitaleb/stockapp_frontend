/*
 * Copyright (c) 2021. stockapp.
 * Proprietary source code; any copy or modification is prohibited.
 *
 * @author Moulaye Abderrahmane <moolsbytheway@gmail.com>
 *
 */

export enum BillProvider {
  SOMELEC=1,
  SNDE,
  MAURITEL
}

export function resolveProvider(id) {
  return id == 1 ? BillProvider.SOMELEC :
    id == 2 ? BillProvider.SNDE :
      id == 3 ? BillProvider.MAURITEL : 'UNKNOWN';

}
