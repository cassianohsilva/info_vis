#!/usr/bin/python3

import numpy as np
import pandas as pd


def main():
	# dataset = pd.read_csv('node_modules/world-atlas/world/node_modules/world-atlas/world/110m.tsv')
	df = pd.read_csv(
		'data/original_dataset.csv',
		# header='infer',
		delimiter=',',
		dtype='str')

	# Rename columns
	df.columns = ['year','country','origin','type','value']

	# Ignore first rows
	df = df.iloc[3:]

	# Convert year to numeric type
	df['year'] = df['year'].astype(int)

	df = df[df['year'] >= 1995]

	# Fix '*' values and convert to numeric type
	df = df.replace({'value': '*'}, '-1')
	df['value'] = df['value'].astype(int)


	##################################################
	################# Countries data #################
	##################################################
	
	df2 = pd.read_csv(
		'node_modules/world-atlas/world/50m.tsv',
		header='infer',
		delimiter='\t')

	# df2.set_index('iso_n3', inplace=True)
	df2.set_index('iso_a3', inplace=True)

	misc = {
		# Countries with different names
		"Bolivia (Plurinational State of)": 'BOL',
		"Central African Rep.": 'CAF',
		"China, Hong Kong SAR": 'HKG',
		"China, Macao SAR": 'MAC',
		"Congo": 'COG',
		"Czech Rep.": 'CZE',
		"Dem. People's Rep. of Korea": 'PRK',
		"Dem. Rep. of the Congo": 'COD',
		"Dominican Rep.": 'DOM',
		"Gambia": 'GMB',
		"Iran (Islamic Rep. of)": 'IRN',
		"Lao People's Dem. Rep.": 'LAO',
		"Micronesia (Federated States of)": 'FSM',
		"Rep. of Korea": 'KOR',
		"Rep. of Moldova": 'MDA' ,
		"Serbia and Kosovo (S/RES/1244 (1999))": 'SRB',
		"Sint Maarten (Dutch part)": 'SXM',
		"State of Palestine": 'PSE',
		"Palestinian": 'PSE',
		"Syrian Arab Rep.": 'SYR',
		"The former Yugoslav Republic of Macedonia": 'MKD',
		"United Rep. of Tanzania": 'TZA',
		"United States of America": 'USA',
		"Venezuela (Bolivarian Republic of)": 'VEN',
		"Viet Nam": 'VNM',

		"Bonaire" : '',
		"Cabo Verde" : 'CPV',
		"French Guiana": '',
		"Gibraltar": '',
		"Guadeloupe": '',
		"Holy See (the)": '',
		"Martinique": '',
		"Saint-Pierre-et-Miquelon": '',
		"Sao Tome and Principe": '',
		"Svalbard and Jan Mayen": '',
		"Tibetan": '',
		"Tuvalu": '',
		"Wallis and Futuna Islands": '',

		# Unkown origins
		"Stateless": '0',
		"Various/Unknown": '1'
	}

	countries = np.unique([df['country'], df['origin']])

	df3 = pd.DataFrame(columns=['id', 'name'], dtype='str')
	# df3['id'] = df3['id'].astype(int)

	for i in countries:

		row = df2[df2.name_long == i]

		t = [[row.index[0] if row.shape[0] > 0 else '', i]]

		if len(t[0][0]) == 0:
			t[0] = [ misc[t[0][1]], t[0][1] ]
			
		temp = pd.DataFrame(
			t,
			columns=['id', 'name'])

		df3 = pd.concat([df3, temp], ignore_index=True)


	names = df3['name'].tolist()
	ids = df3['id'].tolist()

	types = np.unique(df['type'])
	df4 = pd.DataFrame(types, columns=['name'])
	df4['id'] = (df4.index + 1).copy()

	df['country'] = df['country'].replace(to_replace=names, value=ids)
	df['origin'] = df['origin'].replace(to_replace=names, value=ids)

	df = df[df.country != '']
	df = df[df.origin != '']

	df['type'] = df['type'].replace(to_replace=df4['name'].tolist(), value=df4['id'].tolist())

	df.to_csv('data/dataset.csv', index=False)
	df4.to_csv('data/types.csv', index=False, columns=['id', 'name'])


if __name__ == '__main__':
	main()