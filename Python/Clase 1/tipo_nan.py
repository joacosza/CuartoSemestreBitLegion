import math
from decimal import Decimal

# Nan: Not a Number
a = float('nan')
print(f'a: {a}')

# Módulo math
a = float('nan')
print(f'¿Es de tipo Nan?: {math.isnan(a)}')

# Módulo decimal
a = Decimal('nan')
print(f'¿Es de tipo Nan?: {math.isnan(a)}')
