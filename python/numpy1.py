import numpy as np
I=np.array([[1,-3,3],[3,-5,3],[6,-6,4]])

print("\n Given matrix :\n",I)
w,v=np.linalg.eig(I)
print("\n Eigen values: \n")
print("\n Eigen vectors :\n")