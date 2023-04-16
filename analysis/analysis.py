import pandas as pd
from sqlalchemy import create_engine, text
import matplotlib.pyplot as plt

def data_analysis(connection_string):
    # Create a connection object    # Execute a SQL query to read a table
    column_names = ["id", "barcode", "quantity", "price", "saleTime"]
    engine = create_engine(connection_string).connect()
    sales = pd.read_sql_query(text('SELECT * FROM sale'), engine)
    supply = pd.read_sql_query(text('SELECT * FROM supply'), engine)

    new_df = sales.groupby('barcode')[['quantity', 'price']].apply(
        lambda x: (x['quantity'] * x['price']).sum()).reset_index(name='sales')
    new_df2 = supply.groupby('barcode')[['quantity', 'price']].apply(
        lambda x: (x['quantity'] * x['price']).sum()).reset_index(name='cost')

    temp_sales = sales.groupby('barcode')[['quantity', 'price']].apply(lambda x: (x['quantity']).sum()).reset_index(
        name='total_sales')
    temp_supply = supply.groupby('barcode')[['quantity', 'price']].apply(lambda x: (x['quantity']).sum()).reset_index(
        name='total_supply')
    temp_df = temp_sales.merge(temp_supply, on="barcode", how='inner')

    dfinal = new_df2.merge(new_df, on="barcode", how='inner')
    temp3 = dfinal.groupby('barcode')[['cost', 'sales']].apply(
        lambda x: (x['sales'] - x['cost']).sum()).reset_index().rename(columns={0: 'profit'})
    df_info = temp3.merge(temp_df, on="barcode", how='inner')

    df_info['profit_margin'] = (df_info['profit'] - df_info['total_supply']) / df_info['profit'] * 100
    df_info['inventory_turnover'] = df_info['total_sales'] / ((df_info['total_supply'] + df_info['total_sales']) / 2)
    df_info['roi'] = df_info['profit'] / df_info['total_supply']

    # Load the data into a pandas dataframe
    df = df_info

    # Create a bar chart for profit column
    plt.bar(df.index, df['profit'], color='red')
    plt.xlabel('Barcode')
    plt.ylabel('Profit')
    plt.title('Profit by Barcode')
    plt.xticks(df.index, df['barcode'], rotation=90)  # set xticks to barcode column
    plt.savefig('profit_plot.png')  # save plot as image

    # Create a bar chart for total_sales column
    plt.bar(df.index, df['total_sales'], color='blue')
    plt.xlabel('Barcode')
    plt.ylabel('Number of Items Sold')
    plt.title('Number of Items Sold by Barcode')
    plt.xticks(df.index, df['barcode'], rotation=90)  # set xticks to barcode column
    plt.savefig('total_sales_plot.png')  # save plot as image

    # Create a bar chart for roi column
    plt.bar(df.index, df['roi'], color='green')
    plt.xlabel('Barcode')
    plt.ylabel('ROI')
    plt.title('ROI by Barcode')
    plt.xticks(df.index, df['barcode'], rotation=90)  # set xticks to barcode column
    plt.savefig('roi_plot.png')  # save plot as image
    return ('profit_plot.png', 'total_sales_plot.png', 'roi_plot.png')
